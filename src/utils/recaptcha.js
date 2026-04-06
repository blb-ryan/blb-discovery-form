const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Get a reCAPTCHA v3 token for the given action.
 * Returns null if reCAPTCHA is not configured.
 */
export async function getRecaptchaToken(action) {
  if (!SITE_KEY || typeof window === 'undefined' || !window.grecaptcha) {
    return null;
  }

  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}
