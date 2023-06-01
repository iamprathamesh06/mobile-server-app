// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDg59BaKOFU0HX1CMn1LmxI-WvzT1-Vofk",
  authDomain: "spm-project-4bdff.firebaseapp.com",
  projectId: "spm-project-4bdff",
  storageBucket: "spm-project-4bdff.appspot.com",
  messagingSenderId: "135626473842",
  appId: "1:135626473842:web:74ee676d618640876e1deb",
  measurementId: "G-PR6W45FD9T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
