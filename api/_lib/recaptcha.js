const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const THRESHOLD = 0.5;

export async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET) {
    console.warn('[reCAPTCHA] No secret key configured, skipping verification');
    return { success: true, score: 1.0 };
  }

  const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
  });

  const data = await resp.json();

  if (!data.success || data.score < THRESHOLD) {
    return { success: false, score: data.score || 0 };
  }

  return { success: true, score: data.score };
}
