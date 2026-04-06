const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Lazy-initialize Firebase to enable code splitting
let _db = null;

export async function getDb() {
  if (_db) return _db;
  if (!firebaseConfig.apiKey) return null;

  const { initializeApp } = await import('firebase/app');
  const { getFirestore } = await import('firebase/firestore');
  const app = initializeApp(firebaseConfig);
  _db = getFirestore(app);
  return _db;
}
