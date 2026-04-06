import { getDb } from './_lib/firebase-admin.js';
import { verifyRecaptcha } from './_lib/recaptcha.js';
import { sendEmail, buildMagicLinkEmail } from './_lib/brevo.js';

const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, sessionId, recaptchaToken } = req.body;

    // Validate input
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
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

    // Rate limiting
    const emailHash = Buffer.from(email.toLowerCase()).toString('base64url');
    const rateLimitRef = db.collection('magic_link_rate_limits').doc(emailHash);
    const rateLimitSnap = await rateLimitRef.get();

    if (rateLimitSnap.exists) {
      const lastSent = rateLimitSnap.data().lastSentAt?.toMillis?.() || 0;
      const elapsed = Date.now() - lastSent;
      if (elapsed < RATE_LIMIT_MS) {
        const retryAfter = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
        return res.status(429).json({ error: 'Too many requests', retryAfter });
      }
    }

    // Verify session exists
    const sessionRef = db.collection('discovery_sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();
    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Build resume URL and send email
    const resumeUrl = `https://blb-ryan.github.io/blb-discovery-form/#/?session=${sessionId}`;
    const htmlContent = buildMagicLinkEmail(resumeUrl);

    const result = await sendEmail({
      to: email,
      subject: 'Continue Your Business Discovery | Brave Little Beast',
      htmlContent,
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Update rate limit
    await rateLimitRef.set({ lastSentAt: new Date(), email: email.toLowerCase() });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[send-magic-link] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
