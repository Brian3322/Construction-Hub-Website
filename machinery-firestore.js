// machinery-firestore.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

export async function loadMachine(docId) {
  const ref = doc(db, "machinery_website", docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.error(`Machine document "${docId}" not found in machinery_website`);
    return null;
  }
  return snap.data();
}

/**
 * saveUser(userId, data)
 * Writes/updates a user's details in the "user_website" Firestore collection.
 * userId   – the Appwrite account $id (used as the Firestore document ID)
 * data     – plain object of fields to store, e.g.
 *            { name, email, phone, role, company, sellerType }
 */
export async function saveUser(userId, data) {
  if (!userId) {
    console.error("saveUser: missing userId");
    return false;
  }
  try {
    const ref = doc(db, "user_website", userId);
    const existing = await getDoc(ref);

    await setDoc(ref, {
      ...data,
      userId,
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return true;
  } catch (err) {
    console.error(`Failed to save user "${userId}" to user_website:`, err);
    return false;
  }
}
/**
 * loadUser(userId)
 * Reads a user's saved details from the "user_website" Firestore collection.
 * Returns the document data, or null if it doesn't exist.
 */
export async function loadUser(userId) {
  if (!userId) {
    console.error("loadUser: missing userId");
    return null;
  }
  try {
    const ref = doc(db, "user_website", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error(`Failed to load user "${userId}" from user_website:`, err);
    return null;
  }
}