import { useEffect } from 'react';
import { useFormState } from '../hooks/useFormState';
import { useFirestore } from '../hooks/useFirestore';
import Header from './Header';
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
  } = useFormState();

  // Firestore session persistence (gracefully no-ops without config)
  useFirestore({
    sessionId,
    answers,
    iDontKnowCount,
    sectionIndex,
    questionIndex,
    restoreState,
  });

  // Scroll to top on question/section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sectionIndex, questionIndex, showSectionIntro]);

  if (isComplete) {
    return <CompletionScreen />;
  }

  if (showWelcome) {
    return (
      <>
        <Header />
        <WelcomeScreen onStart={dismissWelcome} hasProgress={hasProgress} />
      </>
    );
  }

  const hasEmail = answers.contact_email && answers.contact_email.includes('@');

  return (
    <div className="form-container">
      <Header minimal />
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
          padding-top: 88px; /* space for header + progress bar */
        }
      `}</style>
    </div>
  );
}
