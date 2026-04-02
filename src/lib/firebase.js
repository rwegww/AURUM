import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxZyH9fxQiL6kZIB-rNP3-5I9EJYTBlA4",
  authDomain: "khoaluan-2026.firebaseapp.com",
  projectId: "khoaluan-2026",
  storageBucket: "khoaluan-2026.firebasestorage.app",
  messagingSenderId: "1019302468978",
  appId: "1:1019302468978:web:4bf608e352c26b08ed91eb",
  measurementId: "G-80WC2GF4YT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
