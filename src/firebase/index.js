import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG7DUclSmIixVZa285rO46fw89E3qYnTo",
  authDomain: "assignment-record.firebaseapp.com",
  projectId: "assignment-record",
  storageBucket: "assignment-record.appspot.com",
  messagingSenderId: "662141360149",
  appId: "1:662141360149:web:b97c70136ba3b5ba0f561c",
  measurementId: "G-NKGN35D20W",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { app, storage, auth, db };
