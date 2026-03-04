import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase konfiguratsiyasini .env fayldan o‘qish
const firebaseConfig = {
    apiKey: import.meta.env.apiKey,
    authDomain: import.meta.env.authDomain,
    projectId: import.meta.env.projectId,
    storageBucket: import.meta.env.storageBucket,
    messagingSenderId: import.meta.env.messagingSenderId,
    appId: import.meta.env.appId,
};

// Firebase ilovasini ishga tushirish
const app = initializeApp(firebaseConfig);

// Firestore database-ni eksport qilish
export const db = getFirestore(app);