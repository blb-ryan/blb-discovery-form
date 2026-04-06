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
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="progress-info">
        <div className="progress-dots">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              className={`progress-dot ${
                idx === sectionIndex ? 'progress-dot-active' : ''
              } ${isSectionComplete(idx) ? 'progress-dot-complete' : ''} ${
                idx < sectionIndex ? 'progress-dot-past' : ''
              }`}
              onClick={() => {
                if (idx <= sectionIndex || isSectionComplete(idx - 1)) {
                  onSectionClick(idx);
                }
              }}
              disabled={idx > sectionIndex && !isSectionComplete(idx - 1)}
              title={`${section.number}. ${section.name}`}
              aria-label={`Go to section ${section.number}: ${section.name}`}
              type="button"
            />
          ))}
        </div>

        <span className="progress-section-name">{sectionName}</span>
        <span className="progress-percent">
          {Math.round(progress * 100)}%
        </span>
      </div>

      <style>{`
        .progress-container {
          position: fixed;
          top: 44px;
          left: 0;
          right: 0;
          z-index: var(--z-progress);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          padding: 0;
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

        .progress-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-lg);
          max-width: 900px;
          margin: 0 auto;
        }

        .progress-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .progress-dot:disabled {
          cursor: not-allowed;
          opacity: 0.3;
        }

        .progress-dot-past {
          border-color: var(--text-dim);
          background: var(--text-dim);
        }

        .progress-dot-active {
          border-color: var(--accent);
          background: var(--accent);
          transform: scale(1.3);
        }

        .progress-dot-complete {
          border-color: var(--success);
          background: var(--success);
        }

        .progress-section-name {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-medium);
          letter-spacing: 0.05em;
          color: var(--text-dim);
          flex: 1;
          text-align: center;
        }

        .progress-percent {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-semibold);
          color: var(--text-dim);
          min-width: 32px;
          text-align: right;
        }

        @media (max-width: 600px) {
          .progress-info {
            padding: var(--space-xs) var(--space-md);
          }

          .progress-dots {
            gap: 4px;
          }

          .progress-dot {
            width: 6px;
            height: 6px;
          }

          .progress-section-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
