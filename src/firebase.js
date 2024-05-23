import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB55MDTmsB6LuFuHxOfExFLqMO3Q2QoZHI",
  authDomain: "chatapp-86096.firebaseapp.com",
  projectId: "chatapp-86096",
  storageBucket: "chatapp-86096.appspot.com",
  messagingSenderId: "857613353270",
  appId: "1:857613353270:web:462ea0acbda1535d0b7397",
  measurementId: "G-VH6JQVH9Z0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
