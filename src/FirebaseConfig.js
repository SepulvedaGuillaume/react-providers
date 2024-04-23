// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUm2mvDbudhIw0Q0wxQYEWmSAO1PcSSDs",
  authDomain: "providers-ce21d.firebaseapp.com",
  projectId: "providers-ce21d",
  storageBucket: "providers-ce21d.appspot.com",
  messagingSenderId: "937953548561",
  appId: "1:937953548561:web:81fcf1c36e7fdb6853d4b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;