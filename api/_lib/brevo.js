const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER = { name: 'Brave Little Beast', email: 'hello@bravelittlebeast.com' };

export async function sendEmail({ to, subject, htmlContent }) {
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] No API key configured, skipping email');
    return { success: false, error: 'No API key' };
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error('[Brevo] Email send failed:', resp.status, err);
    return { success: false, error: err };
  }

  return { success: true };
}

export function buildMagicLinkEmail(resumeUrl) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#1A1C15; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1C15; padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:30px; text-align:center; color:#EAE3DE; font-size:14px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">
          BRAVE LITTLE BEAST
        </td></tr>
        <tr><td style="padding-bottom:16px; text-align:center; color:#EAE3DE; font-size:22px; font-weight:bold;">
          Pick up where you left off
        </td></tr>
        <tr><td style="padding-bottom:30px; text-align:center; color:#9B9690; font-size:15px; line-height:1.6;">
          Your Business Discovery questionnaire is saved and waiting for you. Click below to continue.
        </td></tr>
        <tr><td align="center" style="padding-bottom:40px;">
          <a href="${resumeUrl}" style="display:inline-block; background:#D48950; color:#1A1C15; padding:14px 36px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
            Continue Your Discovery
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid #2E3027; padding-top:24px; text-align:center; color:#5A5650; font-size:12px; line-height:1.5;">
          This link is unique to your submission.<br>
          If you didn't request this, you can ignore this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildNotificationEmail({ companyName, contactName, email, phone, complexityTier, involvementLevel, notionUrl }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#ffffff; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:20px; font-size:20px; font-weight:bold; color:#1A1C15;">
          New Discovery Submission
        </td></tr>
        <tr><td style="padding-bottom:24px; font-size:15px; color:#444; line-height:1.6;">
          <strong>Company:</strong> ${companyName}<br>
          <strong>Contact:</strong> ${contactName}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Complexity:</strong> ${complexityTier}<br>
          <strong>Involvement:</strong> ${involvementLevel}
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <a href="${notionUrl}" style="display:inline-block; background:#D48950; color:#ffffff; padding:12px 28px; border-radius:6px; text-decoration:none; font-size:14px; font-weight:bold;">
            View in Notion
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
