// Firebase initialization for the frontend
// Using your provided configuration. Consider moving these values to Vite env vars later.

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCMRXigK7HpyUVM-K1jzsl85noTgEp8qOI',
  authDomain: 'quant-fc4fe.firebaseapp.com',
  projectId: 'quant-fc4fe',
  storageBucket: 'quant-fc4fe.firebasestorage.app',
  messagingSenderId: '629999494270',
  appId: '1:629999494270:web:365f5bdcfe37a59b2b242f',
  measurementId: 'G-Z0KQPN27J6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only when supported (prevents SSR/build-time issues)
let analytics = undefined;
try {
  if (typeof window !== 'undefined') {
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })
      .catch(() => {
        // ignore analytics init errors in unsupported environments
      });
  }
} catch (e) {
  // no-op
}

// Initialize Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Optional helpers
export async function signInWithGooglePopup() {
  const { signInWithPopup } = await import('firebase/auth');
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  const { signOut } = await import('firebase/auth');
  return signOut(auth);
}

export { app, auth, googleProvider, analytics };
