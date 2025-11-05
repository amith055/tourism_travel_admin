import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3hSakcDx0B_IT3Huw1Z_9MguKe5CbwgE",
  authDomain: "fir-databse-cc52d.firebaseapp.com",
  projectId: "fir-databse-cc52d",
  storageBucket: "fir-databse-cc52d.appspot.com",
  messagingSenderId: "38395896470",
  appId: "1:38395896470:web:715795d9b6d6c6a95918b7",
  measurementId: "G-ZH9WDK4214"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
