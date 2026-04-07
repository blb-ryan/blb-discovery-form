const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Get a reCAPTCHA v3 token for the given action.
 * Returns null if reCAPTCHA is not configured or fails.
 * Times out after 5 seconds to prevent hanging.
 */
export async function getRecaptchaToken(action) {
  if (!SITE_KEY || typeof window === 'undefined' || !window.grecaptcha) {
    return null;
  }

  // Race between the reCAPTCHA call and a timeout
  return Promise.race([
    new Promise((resolve) => {
      try {
        window.grecaptcha.ready(() => {
          try {
            window.grecaptcha
              .execute(SITE_KEY, { action })
              .then(resolve)
              .catch(() => resolve(null));
          } catch {
            resolve(null);
          }
        });
      } catch {
        resolve(null);
      }
    }),
    new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
  ]);
}
