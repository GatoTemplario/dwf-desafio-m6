import * as serviceAccount from "../../key.json" 
import * as admin from "firebase-admin"
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore";
import { app } from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
})

const firebaseConfig = {
    apiKey: "AIzaSyC26F8PX8wYVqvkiv-ntZCWUpi7JISV7GU",
    authDomain: "apx-dwf-m6-d5c3f.firebaseapp.com",
    databaseURL: "https://apx-dwf-m6-d5c3f-default-rtdb.firebaseio.com",
    projectId: "apx-dwf-m6-d5c3f",
    storageBucket: "apx-dwf-m6-d5c3f.appspot.com",
    messagingSenderId: "1063316522860",
    appId: "1:1063316522860:web:3bc19eb801ed642f971549",
    measurementId: "G-SQ076KS05K"
};

const dbApp = initializeApp(firebaseConfig);
const rtdb  = getDatabase(dbApp);
const fs    = admin.firestore()
const db    = getFirestore(dbApp)

fs.settings({ignoreUndefinedProperties: true})

export { dbApp, rtdb, fs, db }