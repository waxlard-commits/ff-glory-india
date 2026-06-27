import { db } from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Signup
window.signup = async function () {

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  email: email,
  server: "",
  guild: "",
  basicCard: 0,
  premiumCard: 0,
  orders: 0,
  createdAt: new Date().toISOString()
});

alert("Account created successfully!");
  } catch (error) {
    alert(error.message);
  }

};

// Login
window.login = async function () {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("userEmail", email);

    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }

};

// Logout
window.logout = async function () {

  await signOut(auth);

  localStorage.removeItem("userEmail");

  window.location.href = "index.html";

};

// Check Login Status
onAuthStateChanged(auth, (user) => {

  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("No user logged in");
  }

});