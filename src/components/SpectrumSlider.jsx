export default function SpectrumSlider({ leftLabel, rightLabel, value, onSelect }) {
  const selected = value ? parseInt(value, 10) : null;

  return (
    <div className="spectrum-slider">
      <div className="spectrum-labels">
        <span className="spectrum-label">{leftLabel}</span>
        <span className="spectrum-label">{rightLabel}</span>
      </div>

      <div className="spectrum-buttons">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`spectrum-btn${selected === n ? ' spectrum-btn-selected' : ''}`}
            onClick={() => onSelect(String(n))}
            type="button"
            aria-label={`${n} of 5`}
            aria-pressed={selected === n}
          >
            {n}
          </button>
        ))}
      </div>

      <style>{`
        .spectrum-slider {
          width: 100%;
          max-width: 480px;
          margin: var(--space-xl) 0 var(--space-2xl);
        }

        .spectrum-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-lg);
        }

        .spectrum-label {
          font-size: 0.9375rem;
          font-weight: var(--font-weight-medium);
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        .spectrum-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .spectrum-btn {
          flex: 1;
          height: 52px;
          min-width: 48px;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-family);
          font-size: 1rem;
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: background 150ms ease-out, border-color 150ms ease-out,
                      color 150ms ease-out, transform 150ms ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
        }

        .spectrum-btn:hover {
          background: var(--accent-dim);
          border-color: var(--accent);
          color: var(--accent);
        }

        .spectrum-btn:focus-visible {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent-dim);
        }

        .spectrum-btn-selected {
          background: var(--accent) !important;
          border-color: var(--accent) !important;
          color: var(--bg-primary) !important;
          transform: scale(1.08);
          font-weight: var(--font-weight-bold);
        }

        @media (max-width: 600px) {
          .spectrum-label {
            font-size: 0.875rem;
          }

          .spectrum-buttons {
            gap: 8px;
          }

          .spectrum-btn {
            height: 52px;
            font-size: 0.9375rem;
          }
        }
      `}</style>
    </div>
  );
}
