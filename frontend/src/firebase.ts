import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBPvB5kIwCvAzunkUE2aqkAtNYmu_Y5Ct4",
    authDomain: "desgrabador-de-audios.firebaseapp.com",
    projectId: "desgrabador-de-audios",
    storageBucket: "desgrabador-de-audios.firebasestorage.app",
    messagingSenderId: "645159627220",
    appId: "1:645159627220:web:c7bf0a6042ad72c1e48e41",
    measurementId: "G-TNNP19R2ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
