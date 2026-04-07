export default function WelcomeScreen({ onStart, hasProgress, onReset }) {
  return (
    <div className="welcome-screen fade-in">
      <div className="welcome-content">
        <div className="welcome-header">
          <img
            src={`${import.meta.env.BASE_URL}blb-logo-white.svg`}
            alt="Brave Little Beast"
            className="welcome-logo"
          />
          <div className="welcome-divider" />
          <h1 className="welcome-title">Business Discovery</h1>
        </div>

        <p className="welcome-body">
          This questionnaire is how we get to know your business, your market,
          and what you're building toward. Your answers shape everything we do
          together, from strategy to creative direction.
        </p>

        <p className="welcome-body">
          It's thorough. It'll take 25-40 minutes. But the more you put in, the
          better the work comes out.
        </p>

        <div className="welcome-details">
          <div className="welcome-detail">
            <span className="welcome-detail-icon">{'\u{1F4CB}'}</span>
            <span>13 sections covering your business, brand, and goals</span>
          </div>
          <div className="welcome-detail">
            <span className="welcome-detail-icon">{'\u{1F4BE}'}</span>
            <span>Your progress saves automatically. Come back any time.</span>
          </div>
          <div className="welcome-detail">
            <span className="welcome-detail-icon">{'\u{1F914}'}</span>
            <span>"I don't know yet" is always a valid answer</span>
          </div>
        </div>

        <button
          className="btn btn-primary welcome-btn"
          onClick={onStart}
          type="button"
        >
          {hasProgress ? 'Continue where you left off' : "Let's get started"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {hasProgress && (
          <>
            <p className="welcome-resume-note">
              We saved your progress from last time.
            </p>
            <button
              className="welcome-reset-btn"
              onClick={() => {
                if (window.confirm('This will clear all your answers and start a brand new form. Are you sure?')) {
                  onReset();
                }
              }}
              type="button"
            >
              Start over with a blank form
            </button>
          </>
        )}
      </div>

      <style>{`
        .welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-2xl) var(--space-lg);
          text-align: center;
        }

        .welcome-content {
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
        }

        .welcome-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-sm);
        }

        .welcome-logo {
          width: 240px;
          height: auto;
        }

        .welcome-divider {
          width: 40px;
          height: 1px;
          background: var(--border);
        }

        .welcome-title {
          font-size: 1.125rem;
          font-weight: var(--font-weight-semibold);
          color: var(--accent);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .welcome-body {
          font-size: 1.0625rem;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 460px;
        }

        .welcome-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          text-align: left;
          width: 100%;
          max-width: 420px;
          padding: var(--space-lg);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--border-radius-lg);
          margin: var(--space-sm) 0;
        }

        .welcome-detail {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          font-size: 0.9375rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .welcome-detail-icon {
          font-size: 1.125rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .welcome-btn {
          margin-top: var(--space-md);
          min-width: 220px;
          padding: var(--space-md) var(--space-2xl);
          font-size: 0.9375rem;
        }

        .welcome-resume-note {
          font-size: 0.8125rem;
          color: var(--accent);
          font-weight: var(--font-weight-medium);
        }

        .welcome-reset-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          font-family: var(--font-family);
          font-size: 0.75rem;
          cursor: pointer;
          padding: var(--space-xs) var(--space-sm);
          transition: color var(--transition-fast);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .welcome-reset-btn:hover {
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .welcome-screen {
            padding: var(--space-xl) var(--space-md);
          }

          .welcome-logo {
            width: 180px;
          }

          .welcome-title {
            font-size: 1rem;
          }

          .welcome-body {
            font-size: 1rem;
          }

          .welcome-details {
            padding: var(--space-md);
          }
        }
      `}</style>
    </div>
  );
}
