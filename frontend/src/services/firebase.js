import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration from environment or project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxmsHfWBsVLA7foz89sk77LTx2HGSraHM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskflow-37e31.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskflow-37e31",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskflow-37e31.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186043765044",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186043765044:web:5e9d8e829ea72657019561",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NMNKPEQCLV",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Analytics if supported in the browser environment
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.debug('Firebase Analytics not supported in this environment:', err);
  });
}

export default app;
