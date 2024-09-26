// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey : "AIzaSyD6zgYzSAWBQDiIfWteIiUAaKe2TUYuQ90" , 
    authDomain : "project01-cvvh.firebaseapp.com" , 
    projectId : "project01-cvvh" , 
    storageBucket : "project01-cvvh.appspot.com" , 
    messagingSenderId : "910237601781" , 
    appId : "1:910237601781:web:e1e09b3132d392fe185abc" , 
    measurementId : "G-ER8TH7EH5X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
