import { useEffect, useState, useRef } from 'react';
import { useFormState } from '../hooks/useFormState';
import { useFirestore } from '../hooks/useFirestore';
import { callApi } from '../utils/api';
import { getRecaptchaToken } from '../utils/recaptcha';
import WelcomeScreen from './WelcomeScreen';
import Question from './Question';
import SectionIntro from './SectionIntro';
import ProgressBar from './ProgressBar';
import CompletionScreen from './CompletionScreen';
import MagicLinkBanner from './MagicLinkBanner';

export default function FormContainer() {
  const {
    answers,
    iDontKnowCount,
    sectionIndex,
    questionIndex,
    showWelcome,
    showSectionIntro,
    isComplete,
    direction,
    sessionId,
    currentSection,
    currentQuestion,
    visibleQuestions,
    progress,
    hasProgress,
    setAnswer,
    goNext,
    goBack,
    goToSection,
    isSectionComplete,
    restoreState,
    dismissWelcome,
    resetForm,
  } = useFormState();

  // Firestore session persistence (gracefully no-ops without config)
  const { saveNow } = useFirestore({
    sessionId,
    answers,
    iDontKnowCount,
    sectionIndex,
    questionIndex,
    restoreState,
  });

  // Submission state
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // idle | submitting | success | error
  const hasSubmitted = useRef(false);

  // Trigger submission when form completes
  useEffect(() => {
    if (!isComplete || hasSubmitted.current) return;
    hasSubmitted.current = true;

    (async () => {
      setSubmissionStatus('submitting');
      try {
        // Flush Firestore save first
        if (saveNow) await saveNow();
        // Small delay to ensure Firestore write propagates
        await new Promise((r) => setTimeout(r, 500));

        const recaptchaToken = await getRecaptchaToken('submit_discovery');
        const result = await callApi('/api/submit-discovery', { sessionId, recaptchaToken });
        setSubmissionStatus('success');
      } catch (err) {
        console.error('[Submit] Error:', err);
        setSubmissionStatus('error');
        hasSubmitted.current = false; // allow retry
      }
    })();
  }, [isComplete, sessionId, saveNow]);

  // Scroll to top on question/section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sectionIndex, questionIndex, showSectionIntro]);

  if (isComplete) {
    return (
      <CompletionScreen
        status={submissionStatus}
        onRetry={() => {
          hasSubmitted.current = false;
          setSubmissionStatus('idle');
          setTimeout(() => { hasSubmitted.current = false; }, 0);
        }}
        onReset={resetForm}
      />
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={dismissWelcome} hasProgress={hasProgress} onReset={resetForm} />;
  }

  const hasEmail = answers.contact_email && answers.contact_email.includes('@');

  return (
    <div className="form-container">
      <ProgressBar
        progress={progress}
        sectionIndex={sectionIndex}
        sectionName={currentSection ? `${currentSection.number}. ${currentSection.name}` : ''}
        onSectionClick={goToSection}
        isSectionComplete={isSectionComplete}
      />

      <main className="form-main" key={`${sectionIndex}-${questionIndex}-${showSectionIntro}`}>
        {showSectionIntro && currentSection ? (
          <SectionIntro
            section={currentSection}
            onStart={goNext}
          />
        ) : currentQuestion ? (
          <Question
            question={currentQuestion}
            value={answers[currentQuestion.id] || ''}
            onChange={setAnswer}
            onNext={goNext}
            onBack={goBack}
            direction={direction}
            sectionNumber={currentSection?.number}
            questionNumber={
              visibleQuestions.findIndex((q) => q.id === currentQuestion.id) + 1
            }
            totalInSection={visibleQuestions.length}
          />
        ) : null}
      </main>

      {hasEmail && (
        <MagicLinkBanner
          email={answers.contact_email}
          sessionId={sessionId}
        />
      )}

      <style>{`
        .form-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .form-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 64px; /* space for progress header (no dots) */
        }
      `}</style>
    </div>
  );
}
