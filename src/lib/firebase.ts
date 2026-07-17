import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const isCustomFirebase = !!import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0445592793.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0445592793",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0445592793.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "535716392751",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:535716392751:web:091ee9aa5d9e70070fbbda",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || (isCustomFirebase ? undefined : "ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd");
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
