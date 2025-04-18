// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC5oKCh0JXcPiBpvG8_iq51FkX7x4o4Uy4",
    authDomain: "scribbly-b8c07.firebaseapp.com",
    projectId: "scribbly-b8c07",
    storageBucket: "scribbly-b8c07.firebasestorage.app",
    messagingSenderId: "235069718747",
    appId: "1:235069718747:web:8f08351b5c0140aa520cfe"
  };  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
