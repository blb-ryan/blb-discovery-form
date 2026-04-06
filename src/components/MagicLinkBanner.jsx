import { useState } from 'react';
import { callApi } from '../utils/api';
import { getRecaptchaToken } from '../utils/recaptcha';

export default function MagicLinkBanner({ email, sessionId }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | rateLimit
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    if (!email) {
      setStatus('error');
      setErrorMsg('Enter your email first');
      return;
    }

    setStatus('sending');

    try {
      const recaptchaToken = await getRecaptchaToken('send_magic_link');
      await callApi('/api/send-magic-link', { email, sessionId, recaptchaToken });
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      if (err.status === 429) {
        const retryAfter = err.data?.retryAfter || 300;
        setStatus('rateLimit');
        setErrorMsg(`Please wait ${Math.ceil(retryAfter / 60)} min before requesting another link`);
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        console.error('[MagicLink] Error:', err);
        setStatus('error');
        setErrorMsg('Something went wrong. Try again.');
        setTimeout(() => setStatus('idle'), 4000);
      }
    }
  };

  return (
    <div className="magic-link-banner">
      <button
        className="magic-link-btn"
        onClick={handleSave}
        disabled={status === 'sending'}
        type="button"
      >
        {status === 'sending' && (
          <span className="magic-link-spinner" />
        )}
        {status === 'sent' ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Link sent!
          </>
        ) : status === 'error' || status === 'rateLimit' ? (
          errorMsg
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save & Continue Later
          </>
        )}
      </button>

      <style>{`
        .magic-link-banner {
          position: fixed;
          bottom: var(--space-lg);
          right: var(--space-lg);
          z-index: var(--z-banner);
        }

        .magic-link-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-family);
          font-size: 0.8125rem;
          font-weight: var(--font-weight-medium);
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-lg);
          padding: var(--space-sm) var(--space-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          min-height: 44px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .magic-link-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-dim);
          background: var(--bg-card-alt);
        }

        .magic-link-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .magic-link-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 600ms linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .magic-link-banner {
            bottom: var(--space-md);
            right: var(--space-md);
            left: var(--space-md);
          }

          .magic-link-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
