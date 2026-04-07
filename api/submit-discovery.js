import { getDb } from './_lib/firebase-admin.js';
import { verifyRecaptcha } from './_lib/recaptcha.js';
import { buildNotionProperties, buildNotionContent } from './_lib/notionMapping.js';
import { createDiscoveryPage } from './_lib/notion.js';
import { sendEmail, buildNotificationEmail } from './_lib/brevo.js';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, recaptchaToken } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const captcha = await verifyRecaptcha(recaptchaToken);
      if (!captcha.success) {
        return res.status(403).json({ error: 'reCAPTCHA verification failed' });
      }
    }

    const db = getDb();

    // Read session data from Firestore
    const sessionRef = db.collection('discovery_sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionSnap.data();

    // Idempotency: if already submitted, return existing result
    if (sessionData.submittedAt) {
      return res.status(200).json({
        success: true,
        alreadySubmitted: true,
        notionPageUrl: sessionData.notionPageUrl || null,
      });
    }

    const { answers, iDontKnowCount } = sessionData;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'No answers found in session' });
    }

    // Compute complexity and build Notion data (server-side, never trust client)
    const { properties, complexity } = buildNotionProperties(answers, iDontKnowCount || 0);
    const markdownContent = buildNotionContent(answers);

    // Create Notion page
    let notionPageUrl;
    try {
      notionPageUrl = await createDiscoveryPage(properties, markdownContent);
    } catch (notionErr) {
      console.error('[submit-discovery] Notion API error:', notionErr.message, notionErr.body || notionErr.code || '');
      return res.status(500).json({ error: 'Failed to create Notion page', detail: notionErr.message });
    }

    // Send notification email to BLB team
    const contactName = [answers.contact_first_name, answers.contact_last_name]
      .filter(Boolean).join(' ');

    try {
      await sendEmail({
        to: 'hello@bravelittlebeast.com',
        subject: `New Discovery Submission: ${answers.company_name || 'Unknown Company'}`,
        htmlContent: buildNotificationEmail({
          companyName: answers.company_name || 'Unknown',
          contactName,
          email: answers.contact_email || '',
          phone: answers.contact_phone || '',
          complexityTier: complexity.tier,
          involvementLevel: complexity.involvementLevel,
          notionUrl: notionPageUrl,
        }),
      });
    } catch (emailErr) {
      // Non-fatal: Notion page was created, just log the email failure
      console.error('[submit-discovery] Notification email failed:', emailErr);
    }

    // Update Firestore session with submission metadata
    await sessionRef.update({
      submittedAt: new Date().toISOString(),
      notionPageUrl,
      complexityScore: complexity.score,
      complexityTier: complexity.tier,
      involvementLevel: complexity.involvementLevel,
    });

    return res.status(200).json({
      success: true,
      notionPageUrl,
    });
  } catch (err) {
    console.error('[submit-discovery] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
