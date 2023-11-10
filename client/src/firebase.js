// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ilumi-estate.firebaseapp.com",
  projectId: "ilumi-estate",
  storageBucket: "ilumi-estate.appspot.com",
  messagingSenderId: "492780112861",
  appId: "1:492780112861:web:479a75951128231a1b0434",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
