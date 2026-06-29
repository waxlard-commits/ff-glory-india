import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =======================
// SIGNUP START
// =======================

window.signup = async function () {

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (email === "" || password === "") {
    alert("Please enter email and password.");
    return;
  }
    try {

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      server: "",
      guild: "",
      basicCard: 0,
      premiumCard: 0,
      orders: 0,
      createdAt: new Date().toISOString()
    });

    alert("✅ Account created successfully!");

    if (email === "admin@guildglory.com") {
    window.location.href = "admin.html";
} else {
    window.location.href = "dashboard.html";
    }

  } catch (error) {

    console.error(error);

    switch (error.code) {

      case "auth/email-already-in-use":
        alert("❌ This email is already registered.");
        break;

      case "auth/invalid-email":
        alert("❌ Invalid email address.");
        break;

      case "auth/weak-password":
        alert("❌ Password must be at least 6 characters.");
        break;

      default:
        alert(error.code + "\n" + error.message);

    }

  }

};

// =======================
// LOGIN START
// =======================

window.login = async function () {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (email === "" || password === "") {
    alert("Please enter email and password.");
    return;
  }  try {

    await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("userEmail", email);

    const user = auth.currentUser;

    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          server: "",
          guild: "",
          basicCard: 0,
          premiumCard: 0,
          orders: 0,
          createdAt: new Date().toISOString()
        });
      }
    }

    alert("✅ Login Successful!");

    window.location.href = "dashboard.html";

  } catch (error) {

    console.error(error);

    switch (error.code) {

      case "auth/invalid-credential":
        alert("❌ Wrong email or password.");
        break;

      case "auth/user-not-found":
        alert("❌ Account not found.");
        break;

      case "auth/wrong-password":
        alert("❌ Wrong password.");
        break;

      default:
        alert(error.code + "\n" + error.message);

    }

  }

};

// =======================
// LOGOUT
// =======================

window.logout = async function () {

  await signOut(auth);

  localStorage.removeItem("userEmail");

  window.location.href = "index.html";

};

// =======================
// AUTH CHECK
// =======================

onAuthStateChanged(auth, (user) => {

  if (user) {
    console.log("Logged in:", user.email);
  } else {
    console.log("No user logged in");
  }

});
