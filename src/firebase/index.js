import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEsd-lNqTbDgA9SHsMvkDfCie-CVpNcHc",
  authDomain: "junior-notes-hub.firebaseapp.com",
  projectId: "junior-notes-hub",
  storageBucket: "junior-notes-hub.appspot.com",
  messagingSenderId: "931694896089",
  appId: "1:931694896089:web:a5fcd409d4620ee486efc8",
  measurementId: "G-TXLXHXYHBG"
};

const apps = initializeApp(firebaseConfig);
const db = getFirestore(apps);
const storage = getStorage(apps);
const auth = getAuth(apps);
export { apps, storage, auth, db };
