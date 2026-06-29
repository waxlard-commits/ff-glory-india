// =========================
// FF Glory India - App.js Part 1
// =========================

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();

// Login / Signup Mode
let isLogin = true;

// Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const switchText = document.getElementById("switchMode");

// Change Login / Signup Mode
function changeMode(login = true) {

    isLogin = login;

    if (login) {
        loginBtn.innerText = "LOGIN NOW";
        switchText.innerHTML =
        `Don't have an account?
        <span onclick="changeMode(false)">Create Account</span>`;
    } else {
        loginBtn.innerText = "CREATE ACCOUNT";
        switchText.innerHTML =
        `Already have an account?
        <span onclick="changeMode(true)">Login</span>`;
    }
}

// Login / Signup
loginBtn?.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter Email & Password");
        return;
    }

    try {

        if (isLogin) {

            await auth.signInWithEmailAndPassword(email, password);

            window.location.href = "dashboard.html";

        } else {

            const user =
            await auth.createUserWithEmailAndPassword(email, password);

            await db.collection("users")
            .doc(user.user.uid)
            .set({

                email: email,
                credits: 0,
                orders: 0,
                guildUID: "",
                server: "",
                createdAt: new Date()

            });

            alert("Account Created Successfully");

            window.location.href = "dashboard.html";

        }

    } catch (e) {

        alert(e.message);

    }

});
// =========================
// Dashboard Part
// =========================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        if(location.pathname.includes("dashboard")){
            window.location.href="index.html";
        }

        return;
    }

    const emailBox=document.getElementById("userEmail");
    const basicCard=document.getElementById("basicCard");
    const orders=document.getElementById("orders");
    const savedEmail=document.getElementById("savedEmail");
    const savedUID=document.getElementById("savedUID");
    const savedServer=document.getElementById("savedServer");

    if(emailBox) emailBox.innerText=user.email;
    if(savedEmail) savedEmail.innerText=user.email;

    try{

        const doc=await db.collection("users")
        .doc(user.uid)
        .get();

        if(doc.exists){

            const data=doc.data();

            if(basicCard)
                basicCard.innerText=data.credits||0;

            if(orders)
                orders.innerText=data.orders||0;

            if(savedUID)
                savedUID.innerText=data.guildUID||"-";

            if(savedServer)
                savedServer.innerText=data.server||"-";

            const uidInput=document.getElementById("guildUID");
            const server=document.getElementById("server");

            if(uidInput)
                uidInput.value=data.guildUID||"";

            if(server && data.server)
                server.value=data.server;

        }

    }catch(err){

        console.log(err);

    }

});
// =========================
// Product & Payment Part
// =========================

let selectedProduct = "";
let selectedPrice = "";

function selectProduct(product, price) {

    selectedProduct = product;
    selectedPrice = price;

    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");

    if (productName) productName.innerText = product;
    if (productPrice) productPrice.innerText = price;

    alert(product + " Selected Successfully");
}

// Save Guild UID
const launchBtn = document.getElementById("launchBot");

launchBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    const guildUID = document.getElementById("guildUID").value.trim();
    const server = document.getElementById("server").value;

    if (guildUID === "") {
        alert("Enter Guild UID");
        return;
    }

    try {

        const doc = await db.collection("users").doc(user.uid).get();
        const data = doc.data();

        if ((data.credits || 0) <= 0) {
            alert("You don't have any credits.");
            return;
        }

        await db.collection("users").doc(user.uid).update({
            guildUID: guildUID,
            server: server
        });

        alert("Guild UID Saved Successfully");

    } catch (e) {

        alert(e.message);

    }

});

// Submit Payment
const submitBtn = document.getElementById("submitPayment");

submitBtn?.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    if (selectedProduct === "") {
        alert("Please select a product first.");
        return;
    }

    const file = document.getElementById("paymentImage").files[0];

    if (!file) {
        alert("Upload payment screenshot.");
        return;
    }

    alert("Payment submitted successfully. Admin verification pending.");

});
// =========================
// FF Glory India - App.js Part 4
// =========================

// Logout
function logoutUser() {

    auth.signOut()
    .then(() => {

        alert("Logout Successful");
        window.location.href = "index.html";

    })
    .catch((error) => {

        alert(error.message);

    });

}

// Refresh User Data
async function refreshUserData() {

    const user = auth.currentUser;

    if (!user) return;

    try {

        const doc = await db.collection("users")
            .doc(user.uid)
            .get();

        if (!doc.exists) return;

        const data = doc.data();

        document.getElementById("basicCard").innerText = data.credits || 0;
        document.getElementById("orders").innerText = data.orders || 0;
        document.getElementById("savedUID").innerText = data.guildUID || "-";
        document.getElementById("savedServer").innerText = data.server || "-";

    } catch (e) {
        console.log(e);
    }

}

// Auto Refresh
setInterval(() => {

    if (auth.currentUser) {
        refreshUserData();
    }

}, 5000);

// Welcome
console.log("✅ FF Glory India Loaded Successfully");