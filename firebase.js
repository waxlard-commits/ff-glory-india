import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDs3k_Gp2mxCqQ8h0Gtwt6hIlfgDzXZkj0",
  authDomain: "ffindiaglory.firebaseapp.com",
  projectId: "ffindiaglory",
  storageBucket: "ffindiaglory.firebasestorage.app",
  messagingSenderId: "983153794186",
  appId: "1:983153794186:web:971e3cd0aad617027b2173"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
