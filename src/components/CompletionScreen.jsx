export default function CompletionScreen() {
  return (
    <div className="completion-screen celebrate-in">
      <div className="completion-content">
        {/* Placeholder celebration — BLB will replace */}
        <div className="completion-celebration">
          <span className="completion-emoji">{'\u{1F389}'}</span>
        </div>

        <h1 className="completion-title">You did it.</h1>

        <p className="completion-message">
          Seriously, thank you for taking the time to share all of this. We're
          going to dig into your answers and follow up with any clarifying
          questions. If we need to meet, we'll send a link. Talk soon.
        </p>

        <div className="completion-logo">
          <img
            src={`${import.meta.env.BASE_URL}blb-logo-white.svg`}
            alt="Brave Little Beast"
            className="completion-logo-img"
          />
        </div>
      </div>

      <style>{`
        .completion-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-xl) var(--space-lg);
          text-align: center;
        }

        .completion-content {
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
        }

        .completion-celebration {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: var(--accent-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-md);
        }

        .completion-emoji {
          font-size: 3.5rem;
        }

        .completion-title {
          font-size: 2.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .completion-message {
          font-size: 1.0625rem;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 440px;
        }

        .completion-logo {
          margin-top: var(--space-2xl);
          padding-top: var(--space-xl);
          border-top: 1px solid var(--border);
          width: 100%;
        }

        .completion-logo-img {
          width: 180px;
          height: auto;
          opacity: 0.4;
        }

        @media (max-width: 600px) {
          .completion-title {
            font-size: 2rem;
          }

          .completion-celebration {
            width: 100px;
            height: 100px;
          }

          .completion-emoji {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
