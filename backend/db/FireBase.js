// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXYmpilc0gzUpUPUPTkkcDuhrmkIJKc5I",
  authDomain: "competition-a38a1.firebaseapp.com",
  projectId: "competition-a38a1",
  storageBucket: "competition-a38a1.firebasestorage.app",
  messagingSenderId: "547135374585",
  appId: "1:547135374585:web:2e5f5723badc417d7a0e28",
  measurementId: "G-W08R53DJ81"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export {storage}