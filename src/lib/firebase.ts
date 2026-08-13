import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCCbcJBGn6LSuHKCeapuBGfSkte6GCEuis",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "shaswat-ecom.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shaswat-ecom",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "shaswat-ecom.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "839211302991",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:839211302991:web:6e92a44ccdab624d8daa3a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Y4E9Q8622R",
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const isMockFirebase = Boolean(
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("YOUR_") ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("ApiKey123456789") ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("ManojTraders")
);

// Initialize Firestore singleton safely (works in both Node SSR and Browser)
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
