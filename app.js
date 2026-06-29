// ==========================================
// Guild Glory X
// app.js - Part 1
// ==========================================

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
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// SIGN UP
// ==========================================

window.signup = async function () {

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await setDoc(
      doc(db, "users", userCredential.user.uid),
      {
        uid: userCredential.user.uid,
        email: email,
        basicCard: 0,
        premiumCard: 0,
        role: "user",
        status: "active",
        createdAt: serverTimestamp()
      }
    );

    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

};

// ==========================================
// LOGIN
// ==========================================

window.login = async function () {

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email & password");
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href = "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

};
// ==========================================
// AUTH STATE CHECK
// ==========================================

onAuthStateChanged(auth, async (user) => {

  // Sirf dashboard par check karo
  if (!window.location.pathname.includes("dashboard.html")) return;

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("User data not found.");
      return;
    }

    const data = userSnap.data();

    // User Name
    const name = document.getElementById("userName");
    if (name) {
      name.textContent = data.email;
    }

    // Basic Cards
    const basic = document.getElementById("basicCard");
    if (basic) {
      basic.textContent = data.basicCard || 0;
    }

    // Premium Cards
    const premium = document.getElementById("premiumCard");
    if (premium) {
      premium.textContent = data.premiumCard || 0;
    }

  } catch (error) {
    console.error(error);
    alert(error.message);
  }

});

// ==========================================
// LOGOUT
// ==========================================

window.logout = async function () {

  try {

    await signOut(auth);

    window.location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

};
// ==========================================
// PAYMENT SYSTEM
// ==========================================

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Payment Button
const submitBtn = document.getElementById("submitPayment");

if (submitBtn) {

  submitBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    const utr = document.getElementById("utrNumber").value.trim();
    const server = document.getElementById("server").value;
const guildUID = document.getElementById("guildUID").value.trim();
    if (utr.length !== 12) {
    alert("Please enter a valid 12-digit UTR number.");
    return;
}
    const file = document.getElementById("paymentScreenshot").files[0];
  
    if (!utr || !file) {
      alert("Please enter UTR and upload screenshot.");
      return;
    }

    try {

      // Upload Screenshot
      const storageRef = ref(
        storage,
        `payments/${user.uid}/${Date.now()}_${file.name}`
      );

      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);

      // Save Payment
      await addDoc(collection(db, "payments"), {

uid: user.uid,
email: user.email,

server: server,
guildUID: guildUID,

utr: utr,

screenshot: imageUrl,

status: "Pending",

createdAt: serverTimestamp()
      });

      alert("Payment submitted successfully.\nWaiting for Admin Approval.");

      document.getElementById("utrNumber").value = "";
      document.getElementById("paymentScreenshot").value = "";

    } catch (error) {

      alert(error.message);

    }

  });

}