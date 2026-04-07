// firebase.js — Initialize Firebase app and export auth/provider
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase project config — replace with your actual values
// (copy from Firebase Console → Project Settings → General → Your apps)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Restrict sign-in to the college's Google Workspace domain
// e.g. "yourcollegename.edu.in" — change this in .env
const allowedDomain = import.meta.env.VITE_COLLEGE_EMAIL_DOMAIN;
if (allowedDomain) {
    googleProvider.setCustomParameters({ hd: allowedDomain });
}

export default app;
