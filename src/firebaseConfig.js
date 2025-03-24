import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // ✅ IMPORT Firestore

// ✅ Replace with your actual Firebase credentials
const firebaseConfig = {
    apiKey: "AIzaSyB2_zyShLy6CPWHEaLcCPeyoJbsXZFrCrQ",
    authDomain: "mini6-d2e1a.firebaseapp.com",
    projectId: "mini6-d2e1a",
    storageBucket: "mini6-d2e1a.firebasestorage.app",
    messagingSenderId: "800784614301",
    appId: "1:800784614301:web:db5806548d067242f1a574"
  };

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // ✅ Initialize Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, signOut, signInWithEmailAndPassword };
