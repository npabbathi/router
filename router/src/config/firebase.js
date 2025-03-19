// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLbNO4Dp2wIWfEHepJG16YlfnvteBXqrM",
  authDomain: "router-ae6e4.firebaseapp.com",
  projectId: "router-ae6e4",
  storageBucket: "router-ae6e4.firebasestorage.app",
  messagingSenderId: "100137928223",
  appId: "1:100137928223:web:d25661b5b6d328fe48b72a",
  measurementId: "G-LXH0FX9Q15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);