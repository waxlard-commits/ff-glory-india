import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnXd0HXLM2mcsWm1VUP7BZQDljQwo7L5s",
  authDomain: "ff-glory-india.firebaseapp.com",
  projectId: "ff-glory-india",
  storageBucket: "ff-glory-india.firebasestorage.app",
  messagingSenderId: "1041307296241",
  appId: "1:1041307296241:web:777bace6869a6c8aede450"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };