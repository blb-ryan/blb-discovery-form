import { useEffect, useRef, useCallback } from 'react';
import { getDb } from '../firebase';

const COLLECTION = 'discovery_sessions';
const DEBOUNCE_MS = 1500;

// Lazy-import Firestore methods
let _doc, _setDoc, _getDoc;
const loadFirestoreMethods = async () => {
  if (!_doc) {
    const mod = await import('firebase/firestore');
    _doc = mod.doc;
    _setDoc = mod.setDoc;
    _getDoc = mod.getDoc;
  }
};

/**
 * Syncs form state to Firestore for session persistence.
 * Gracefully no-ops if Firebase isn't configured.
 */
export function useFirestore({
  sessionId,
  answers,
  iDontKnowCount,
  sectionIndex,
  questionIndex,
  restoreState,
}) {
  const timerRef = useRef(null);
  const isRestoringRef = useRef(false);
  const dbRef = useRef(null);

  // Initialize DB reference
  useEffect(() => {
    getDb().then((db) => { dbRef.current = db; });
  }, []);

  // Restore session from Firestore on mount (if session param in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const resumeSessionId = params.get('session');
    if (!resumeSessionId) return;

    isRestoringRef.current = true;

    (async () => {
      try {
        const db = await getDb();
        if (!db) return;
        await loadFirestoreMethods();
        const docRef = _doc(db, COLLECTION, resumeSessionId);
        const snap = await _getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          restoreState({
            answers: data.answers || {},
            iDontKnowCount: data.iDontKnowCount || 0,
            sectionIndex: data.sectionIndex || 0,
            questionIndex: data.questionIndex || 0,
          });
        }
      } catch (err) {
        console.warn('[Firestore] Failed to restore session:', err);
      } finally {
        isRestoringRef.current = false;
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save to Firestore on answer changes (debounced)
  useEffect(() => {
    if (isRestoringRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const db = dbRef.current || await getDb();
        if (!db) return;
        await loadFirestoreMethods();
        const docRef = _doc(db, COLLECTION, sessionId);
        await _setDoc(
          docRef,
          {
            answers,
            iDontKnowCount,
            sectionIndex,
            questionIndex,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('[Firestore] Failed to save:', err);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sessionId, answers, iDontKnowCount, sectionIndex, questionIndex]);

  // Manual save trigger (for magic link)
  const saveNow = useCallback(async () => {
    try {
      const db = await getDb();
      if (!db) return;
      await loadFirestoreMethods();
      const docRef = _doc(db, COLLECTION, sessionId);
      await _setDoc(
        docRef,
        {
          answers,
          iDontKnowCount,
          sectionIndex,
          questionIndex,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('[Firestore] Failed to save:', err);
    }
  }, [sessionId, answers, iDontKnowCount, sectionIndex, questionIndex]);

  return { saveNow };
}
