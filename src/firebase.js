import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIOesySZpgkiNVOToXWybPrE788_F6gBM",
  authDomain: "sunflower-garden-874ab.firebaseapp.com",
  projectId: "sunflower-garden-874ab",
  storageBucket: "sunflower-garden-874ab.firebasestorage.app",
  messagingSenderId: "990878187805",
  appId: "1:990878187805:web:c4de0a8dc9ea4a8c7b21f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
