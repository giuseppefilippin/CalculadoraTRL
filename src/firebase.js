// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbfLNxi-9I3Hkn94bZ0hghnBsQy6G7AmM",
  authDomain: "trl-calculator-18a81.firebaseapp.com",
  projectId: "trl-calculator-18a81",
  storageBucket: "trl-calculator-18a81.firebasestorage.app",
  messagingSenderId: "408872870325",
  appId: "1:408872870325:web:8cacb8412fad16d9ec39fc",
  measurementId: "G-5Z11PDBEY7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
