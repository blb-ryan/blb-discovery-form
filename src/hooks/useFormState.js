import { useState, useCallback, useEffect, useRef } from 'react';
import { sections, getVisibleQuestions } from '../utils/questionData';

const STORAGE_KEY = 'blb_discovery_form';
const IDK_VALUE = "I don't know yet";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

export function useFormState() {
  const saved = useRef(loadFromStorage());

  const [answers, setAnswers] = useState(saved.current?.answers || {});
  const [iDontKnowCount, setIDontKnowCount] = useState(saved.current?.iDontKnowCount || 0);
  const [sectionIndex, setSectionIndex] = useState(saved.current?.sectionIndex || 0);
  const [questionIndex, setQuestionIndex] = useState(saved.current?.questionIndex || 0);
  // Always show welcome on page load — returning users see "Continue where you left off"
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSectionIntro, setShowSectionIntro] = useState(
    saved.current ? false : true
  );
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' | 'back'
  const [sessionId] = useState(
    saved.current?.sessionId || crypto.randomUUID()
  );

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage({
      answers,
      iDontKnowCount,
      sectionIndex,
      questionIndex,
      sessionId,
      started: !showWelcome,
    });
  }, [answers, iDontKnowCount, sectionIndex, questionIndex, sessionId, showWelcome]);

  const currentSection = sections[sectionIndex];
  const visibleQuestions = getVisibleQuestions(sectionIndex, answers);
  const currentQuestion = visibleQuestions[questionIndex] || null;

  const setAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => {
      const wasIDK = prev[questionId] === IDK_VALUE;
      const isIDK = value === IDK_VALUE;

      if (wasIDK && !isIDK) {
        setIDontKnowCount((c) => Math.max(0, c - 1));
      } else if (!wasIDK && isIDK) {
        setIDontKnowCount((c) => c + 1);
      }

      return { ...prev, [questionId]: value };
    });
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');

    // If still in intro, proceed to first question
    if (showSectionIntro) {
      setShowSectionIntro(false);
      setQuestionIndex(0);
      return;
    }

    const visible = getVisibleQuestions(sectionIndex, answers);

    // More questions in this section?
    if (questionIndex < visible.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }

    // More sections?
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setQuestionIndex(0);
      setShowSectionIntro(true);
      return;
    }

    // Done!
    setIsComplete(true);
  }, [sectionIndex, questionIndex, showSectionIntro, answers]);

  const goBack = useCallback(() => {
    setDirection('back');

    // If in section intro, go to previous section's last question
    if (showSectionIntro) {
      if (sectionIndex > 0) {
        const prevIdx = sectionIndex - 1;
        setSectionIndex(prevIdx);
        const prevVisible = getVisibleQuestions(prevIdx, answers);
        setQuestionIndex(prevVisible.length - 1);
        setShowSectionIntro(false);
      }
      return;
    }

    // Previous question in this section?
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return;
    }

    // Go to previous section intro
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
      const prevVisible = getVisibleQuestions(sectionIndex - 1, answers);
      setQuestionIndex(prevVisible.length - 1);
      setShowSectionIntro(false);
    }
  }, [sectionIndex, questionIndex, showSectionIntro, answers]);

  const goToSection = useCallback(
    (idx) => {
      if (idx >= 0 && idx < sections.length) {
        setDirection(idx > sectionIndex ? 'forward' : 'back');
        setSectionIndex(idx);
        setQuestionIndex(0);
        setShowSectionIntro(true);
      }
    },
    [sectionIndex]
  );

  // Calculate overall progress
  const totalVisible = sections.reduce(
    (sum, _, idx) => sum + getVisibleQuestions(idx, answers).length,
    0
  );
  const answeredCount = sections.reduce((sum, _, idx) => {
    const vis = getVisibleQuestions(idx, answers);
    return sum + vis.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;
  }, 0);
  const progress = totalVisible > 0 ? answeredCount / totalVisible : 0;

  // Check if a section is completed
  const isSectionComplete = useCallback(
    (idx) => {
      const vis = getVisibleQuestions(idx, answers);
      return vis.length > 0 && vis.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');
    },
    [answers]
  );

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const hasProgress = Object.keys(answers).length > 0;

  // Restore from external data (Firestore session)
  const restoreState = useCallback((data) => {
    if (data.answers) setAnswers(data.answers);
    if (data.iDontKnowCount != null) setIDontKnowCount(data.iDontKnowCount);
    if (data.sectionIndex != null) setSectionIndex(data.sectionIndex);
    if (data.questionIndex != null) setQuestionIndex(data.questionIndex);
    setShowSectionIntro(false);
  }, []);

  return {
    // State
    answers,
    iDontKnowCount,
    sectionIndex,
    questionIndex,
    showWelcome,
    showSectionIntro,
    isComplete,
    direction,
    sessionId,

    // Derived
    currentSection,
    currentQuestion,
    visibleQuestions,
    progress,
    totalVisible,
    answeredCount,
    hasProgress,

    // Actions
    setAnswer,
    goNext,
    goBack,
    goToSection,
    isSectionComplete,
    restoreState,
    dismissWelcome,
  };
}
