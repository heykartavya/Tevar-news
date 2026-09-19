import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';
import appletConfig from '../../firebase-applet-config.json';

const isCustomFirebase = !!import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: appletConfig.measurementId || ""
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || (isCustomFirebase ? undefined : appletConfig.firestoreDatabaseId);
export const db = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);

let messagingPromise: Promise<Messaging | null> | null = null;

export const getFCM = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null;

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => {
        if (supported) {
          return getMessaging(app);
        }
        return null;
      })
      .catch((err) => {
        console.warn('Firebase Messaging is not supported in this environment:', err);
        return null;
      });
  }
  return messagingPromise;
};

