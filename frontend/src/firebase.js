// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiQIx249tTXHSQOGwllPiJNfZMLjoSpeQ",
  authDomain: "classicustom-acc0d.firebaseapp.com",
  projectId: "classicustom-acc0d",
  storageBucket: "classicustom-acc0d.firebasestorage.app",
  messagingSenderId: "563908932681",
  appId: "1:563908932681:web:3dbc785ccea8db65343b98",
  measurementId: "G-E81QKXBYF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);