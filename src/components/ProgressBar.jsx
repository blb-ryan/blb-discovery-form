import { sections } from '../utils/questionData';

export default function ProgressBar({
  progress,
  sectionIndex,
  sectionName,
  onSectionClick,
  isSectionComplete,
}) {
  return (
    <div className="progress-container">
      <div className="progress-top">
        <a href={`${import.meta.env.BASE_URL}#/`} className="progress-logo-link">
          <img
            src={`${import.meta.env.BASE_URL}blb-logo-white.svg`}
            alt="Brave Little Beast"
            className="progress-logo"
          />
        </a>

        <span className="progress-section-name">{sectionName}</span>

        <span className="progress-percent">
          {Math.round(progress * 100)}%
        </span>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Section dots removed per design feedback */}

      <style>{`
        .progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-progress);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
        }

        .progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-lg);
        }

        .progress-logo-link {
          display: inline-flex;
          flex-shrink: 0;
          transition: opacity var(--transition-fast);
        }

        .progress-logo-link:hover {
          opacity: 0.7;
        }

        .progress-logo {
          height: 36px;
          width: auto;
        }

        .progress-section-name {
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
          letter-spacing: 0.05em;
          color: var(--text-dim);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .progress-percent {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-semibold);
          color: var(--text-dim);
          flex-shrink: 0;
        }

        .progress-bar-track {
          height: 3px;
          background: var(--border);
          width: 100%;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--accent);
          transition: width 400ms cubic-bezier(0.45, 0, 0.43, 0.99);
          border-radius: 0 2px 2px 0;
        }

        @media (max-width: 600px) {
          .progress-top {
            padding: var(--space-xs) var(--space-md);
          }

          .progress-logo {
            height: 28px;
          }

          .progress-section-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
