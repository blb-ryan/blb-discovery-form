export default function SectionIntro({ section, onStart }) {
  return (
    <div className="section-intro section-intro-enter-active">
      <div className="section-intro-content">
        <div className="section-intro-gif">
          {/* Placeholder GIF — BLB will replace with hand-picked ones */}
          <div className="section-intro-gif-placeholder">
            <span className="section-intro-gif-icon">
              {getEmojiForSection(section.number)}
            </span>
          </div>
        </div>

        <span className="section-intro-number">Section {section.number}</span>
        <h1 className="section-intro-title">{section.name}</h1>
        <p className="section-intro-copy">{section.intro}</p>

        {section.sectionNote && (
          <p className="section-intro-note">{section.sectionNote}</p>
        )}

        <span className="section-intro-time">{section.time}</span>

        <button
          className="btn btn-primary section-intro-btn"
          onClick={onStart}
          type="button"
        >
          Let's go
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        .section-intro {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: var(--space-xl) var(--space-lg);
          text-align: center;
        }

        .section-intro-content {
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }

        .section-intro-gif {
          margin-bottom: var(--space-lg);
        }

        .section-intro-gif-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-intro-gif-icon {
          font-size: 2.5rem;
        }

        .section-intro-number {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-semibold);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .section-intro-title {
          font-size: 2rem;
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          line-height: 1.2;
        }

        .section-intro-copy {
          font-size: 1.0625rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 400px;
        }

        .section-intro-note {
          font-size: 0.875rem;
          color: var(--text-dim);
          font-style: italic;
          line-height: 1.5;
          max-width: 400px;
          padding: var(--space-md);
          background: var(--accent-dim);
          border-radius: var(--border-radius);
          border-left: 3px solid var(--accent);
        }

        .section-intro-time {
          font-size: 0.75rem;
          font-weight: var(--font-weight-medium);
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .section-intro-btn {
          margin-top: var(--space-lg);
          min-width: 160px;
        }

        @media (max-width: 600px) {
          .section-intro-title {
            font-size: 1.5rem;
          }

          .section-intro-gif-placeholder {
            width: 80px;
            height: 80px;
          }

          .section-intro-gif-icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

function getEmojiForSection(number) {
  const map = {
    '00': '\u{1F44B}',
    '01': '\u{1F3E2}',
    '02': '\u{1F465}',
    '03': '\u{1F4A1}',
    '04': '\u{1F4B0}',
    '05': '\u{1F30D}',
    '06': '\u{1F4E6}',
    '07': '\u{1F464}',
    '08': '\u{1F3A8}',
    '09': '\u{1F4E3}',
    '10': '\u{1F3AF}',
    '11': '\u{2728}',
    '12': '\u{1F3C6}',
  };
  return map[number] || '\u{2728}';
}
