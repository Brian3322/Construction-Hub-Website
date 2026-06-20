// materials-firestore.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJ4E6DyZlImLmJomyy45XruCObfVemtq8",
  authDomain: "construtionhubv2-8a393.firebaseapp.com",
  projectId: "construtionhubv2-8a393",
  storageBucket: "construtionhubv2-8a393.firebasestorage.app",
  messagingSenderId: "857747425961",
  appId: "1:857747425961:web:386bac01ff77dec28db7b8"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadMaterial(docId) {
  const ref = doc(db, "Materials_Website", docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.error(`Material document "${docId}" not found in Materials_Website`);
    return null;
  }
  return snap.data();
}
