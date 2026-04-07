import { useState, useEffect, useRef, useCallback } from 'react';
import SpectrumSlider from './SpectrumSlider';

const IDK_VALUE = "I don't know yet";

export default function Question({
  question,
  value,
  onChange,
  onNext,
  onBack,
  direction,
  sectionNumber,
  questionNumber,
  totalInSection,
}) {
  const inputRef = useRef(null);
  const animRef = useRef(null);
  const isIDK = value === IDK_VALUE;
  const [error, setError] = useState(null);

  // Focus input on mount + clear error
  useEffect(() => {
    setError(null);
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 350); // after animation
    return () => clearTimeout(timer);
  }, [question.id]);

  // Auto-expand textarea
  const autoExpand = useCallback((el) => {
    if (el && el.tagName === 'TEXTAREA') {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) autoExpand(inputRef.current);
  }, [value, autoExpand]);

  const handleChange = (e) => {
    onChange(question.id, e.target.value);
    autoExpand(e.target);
    if (error) setError(null);
  };

  const tryAdvance = () => {
    if (question.validate) {
      const err = question.validate(value);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    onNext();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && question.type !== 'textarea') {
      e.preventDefault();
      if (value || isIDK) tryAdvance();
    }
    if (e.key === 'Enter' && question.type === 'textarea' && e.metaKey) {
      e.preventDefault();
      if (value || isIDK) tryAdvance();
    }
  };

  const handleIDK = () => {
    onChange(question.id, IDK_VALUE);
    setTimeout(onNext, 200);
  };

  const canAdvance = value !== undefined && value !== '';

  // Animation class based on direction
  const animClass = direction === 'back' ? 'question-back' : 'question';

  // ── Spectrum slider layout ─────────────────────────────────────
  if (question.type === 'spectrum') {
    return (
      <div
        ref={animRef}
        className={`question-wrapper ${animClass}-enter-active`}
        key={question.id}
      >
        <div className="question-meta">
          <span className="question-section-number">{sectionNumber}</span>
          <span className="question-counter">
            {questionNumber} of {totalInSection}
          </span>
        </div>

        <SpectrumSlider
          leftLabel={question.leftLabel}
          rightLabel={question.rightLabel}
          value={value || ''}
          onSelect={(val) => {
            onChange(question.id, val);
            setTimeout(onNext, 400);
          }}
        />

        <div className="question-actions">
          <div />
          <div className="question-nav">
            <button
              className="btn btn-text question-back-btn"
              onClick={onBack}
              type="button"
              aria-label="Previous question"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          .question-wrapper {
            max-width: var(--max-width);
            width: 100%;
            margin: 0 auto;
            padding: var(--space-xl) var(--space-lg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 60vh;
          }
          .question-meta {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            margin-bottom: var(--space-lg);
          }
          .question-section-number {
            font-size: 0.6875rem;
            font-weight: var(--font-weight-semibold);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--accent);
          }
          .question-counter {
            font-size: 0.6875rem;
            font-weight: var(--font-weight-medium);
            letter-spacing: 0.05em;
            color: var(--text-dim);
          }
          .question-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-md);
            flex-wrap: wrap;
          }
          .question-nav {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
          }
          .question-back-btn {
            min-width: 44px;
            min-height: 44px;
            padding: var(--space-sm);
          }
        `}</style>
      </div>
    );
  }

  const renderInput = () => {
    const baseProps = {
      ref: inputRef,
      value: isIDK ? '' : (value || ''),
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      placeholder: question.placeholder || '',
      disabled: isIDK,
      'aria-label': question.text,
    };

    switch (question.type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={question.large ? 4 : 2}
            className={`question-input question-textarea ${question.large ? 'question-textarea-large' : ''}`}
          />
        );

      case 'select':
        return (
          <select
            ref={inputRef}
            value={isIDK ? '' : (value || '')}
            onChange={(e) => {
              onChange(question.id, e.target.value);
              if (e.target.value) {
                setTimeout(onNext, 300);
              }
            }}
            className="question-input question-select"
            aria-label={question.text}
          >
            <option value="" disabled>
              {question.placeholder || 'Select one'}
            </option>
            {question.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            {...baseProps}
            type="date"
            className="question-input question-date"
          />
        );

      case 'email':
        return (
          <input
            {...baseProps}
            type="email"
            className="question-input"
            autoComplete="email"
          />
        );

      case 'tel':
        return (
          <input
            {...baseProps}
            type="tel"
            className="question-input"
            autoComplete="tel"
          />
        );

      default:
        return (
          <input
            {...baseProps}
            type="text"
            className="question-input"
          />
        );
    }
  };

  return (
    <div
      ref={animRef}
      className={`question-wrapper ${animClass}-enter-active`}
      key={question.id}
    >
      <div className="question-meta">
        <span className="question-section-number">{sectionNumber}</span>
        <span className="question-counter">
          {questionNumber} of {totalInSection}
        </span>
      </div>

      <h2 className="question-text">{question.text}</h2>

      {question.subtitle && (
        <p className="question-subtitle">{question.subtitle}</p>
      )}

      {question.type === 'textarea' && (
        <p className="question-hint">Press Cmd+Enter to continue</p>
      )}

      <div className="question-input-wrapper">
        {renderInput()}
        {isIDK && (
          <div className="question-idk-badge">
            Marked as "I don't know yet"
            <button
              className="question-idk-clear"
              onClick={() => onChange(question.id, '')}
              aria-label="Clear I don't know"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="question-error">{error}</p>
      )}

      <div className="question-actions">
        {!question.hideIDK && (
          <button
            className="btn btn-ghost question-idk-btn"
            onClick={handleIDK}
            type="button"
          >
            I don't know yet
          </button>
        )}
        {question.hideIDK && <div />}

        <div className="question-nav">
          <button
            className="btn btn-text question-back-btn"
            onClick={onBack}
            type="button"
            aria-label="Previous question"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className="btn btn-primary question-next-btn"
            onClick={tryAdvance}
            disabled={!canAdvance}
            type="button"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .question-wrapper {
          max-width: var(--max-width);
          width: 100%;
          margin: 0 auto;
          padding: var(--space-xl) var(--space-lg);
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 60vh;
        }

        .question-meta {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .question-section-number {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-semibold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .question-counter {
          font-size: 0.6875rem;
          font-weight: var(--font-weight-medium);
          letter-spacing: 0.05em;
          color: var(--text-dim);
        }

        .question-text {
          font-size: 1.5rem;
          font-weight: var(--font-weight-medium);
          line-height: 1.4;
          color: var(--text-primary);
          margin-bottom: var(--space-sm);
        }

        .question-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: var(--space-md);
          font-style: italic;
        }

        .question-hint {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-bottom: var(--space-lg);
        }

        .question-input-wrapper {
          margin-bottom: var(--space-2xl);
          position: relative;
        }

        .question-input {
          font-size: 1.125rem;
        }

        .question-textarea {
          min-height: 3.5rem;
        }

        .question-textarea-large {
          min-height: 6rem;
        }

        .question-select {
          cursor: pointer;
        }

        .question-date {
          color-scheme: dark;
        }

        .question-idk-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-sm);
          padding: var(--space-xs) var(--space-md);
          background: var(--accent-dim);
          border-radius: var(--border-radius);
          font-size: 0.8125rem;
          color: var(--accent);
        }

        .question-idk-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-family);
          font-size: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .question-idk-clear:hover {
          color: var(--text-primary);
        }

        .question-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .question-error {
          font-size: 0.875rem;
          color: var(--error);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-sm);
        }

        .question-idk-btn {
          font-size: 0.8125rem;
          text-transform: none;
          letter-spacing: 0;
          font-weight: var(--font-weight-regular);
        }

        .question-nav {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .question-back-btn {
          min-width: 44px;
          min-height: 44px;
          padding: var(--space-sm);
        }

        .question-next-btn {
          min-width: 120px;
        }

        .question-next-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 600px) {
          .question-text {
            font-size: 1.25rem;
          }

          .question-actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .question-nav {
            justify-content: space-between;
          }

          .question-idk-btn {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
