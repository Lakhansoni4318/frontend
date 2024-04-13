import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCb1HShH7I5EOIglAINd8xqbQYueCgHPDE",
  authDomain: "friendnoteshub.firebaseapp.com",
  projectId: "friendnoteshub",
  storageBucket: "friendnoteshub.appspot.com",
  messagingSenderId: "438755235265",
  appId: "1:438755235265:web:2b2526525409400d230b40",
  measurementId: "G-3D2BPQMYXF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { app, storage, auth, db };
