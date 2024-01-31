import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOjD0nPjIlzUKN9t0Gwz3z1GGEgJwVIfU",
  authDomain: "assignment-record-fb62f.firebaseapp.com",
  projectId: "assignment-record-fb62f",
  storageBucket: "assignment-record-fb62f.appspot.com",
  messagingSenderId: "144594445279",
  appId: "1:144594445279:web:9a70d85a8fed8ee1319a6a",
  measurementId: "G-ZSJJ54C408",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { app, storage, auth, db };
