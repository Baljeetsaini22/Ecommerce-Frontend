// function togglePassword(id) {
//   const field = document.getElementById(id);
//   field.type = field.type === "password" ? "text" : "password";
// }

// function showSignup() {
//   document.getElementById("loginForm").classList.add("d-none");
//   document.getElementById("signupForm").classList.remove("d-none");
// }

// function showLogin() {
//   document.getElementById("signupForm").classList.add("d-none");
//   document.getElementById("loginForm").classList.remove("d-none");
// }

// function validateEmail(email) {
//   return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
// }

// function checkStrength(password) {
//   const strengthEl = document.getElementById("strength");
//   let strength = "Weak";
//   if (
//     password.length >= 8 &&
//     /[A-Z]/.test(password) &&
//     /[a-z]/.test(password) &&
//     /\d/.test(password)
//   ) {
//     strength = "Strong";
//   } else if (password.length >= 6) {
//     strength = "Medium";
//   }
//   strengthEl.textContent = `Password strength: ${strength}`;
// }

// // Signup Form Submit
// document.getElementById("signupForm").onsubmit = function (e) {
//   e.preventDefault();

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("signupEmail").value;
//   const password = document.getElementById("signupPassword").value;
//   const confirm = document.getElementById("confirmPassword").value;

//   if (!validateEmail(email)) {
//     alert("Invalid email format.");
//     return;
//   }

//   if (password !== confirm) {
//     alert("Passwords do not match.");
//     return;
//   }

//   if (
//     password.length < 8 ||
//     !/[A-Z]/.test(password) ||
//     !/[a-z]/.test(password) ||
//     !/\d/.test(password)
//   ) {
//     alert("Password must contain uppercase, lowercase, and a number.");
//     return;
//   }

//   const user = { name, email, password };
//   localStorage.setItem("auth", JSON.stringify(user));
//   alert("Signup successful! Please log in.");
//   showLogin(); // Redirect to login form
// };

// // Login Form Submit
// document.getElementById("loginForm").onsubmit = function (e) {
//   e.preventDefault();

//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;
//   const savedUser = JSON.parse(localStorage.getItem("auth"));

//   if (!validateEmail(email)) {
//     alert("Invalid email format.");
//     return;
//   }

//   if (!password) {
//     alert("Password required.");
//     return;
//   }

//   if (!savedUser || email !== savedUser.email || password !== savedUser.password) {
//     alert("Incorrect email or password.");
//     return;
//   }

//   localStorage.setItem("isLogin", "true");
//   alert("Login successful!");
//   window.location.href = "/"; // Redirect to homepage after login
// };

// // Show login status on homepage (index.html)
// const showLoginUser = document.querySelector(".login");
// const getUserAuth = JSON.parse(localStorage.getItem("auth"));
// const isLogin = localStorage.getItem("isLogin");

// if (showLoginUser) {
//   if (getUserAuth && isLogin === "true") {
//     showLoginUser.innerHTML = `Hi! ${getUserAuth.name}`;
//   } else {
//     showLoginUser.innerHTML = `<a href="../pages/auth.html">Login</a>`;
//   }
// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDP2TktQJUtRfloWBoKTwlnzEJeRlUSS6M",
  authDomain: "ecommerce-project-eda80.firebaseapp.com",
  projectId: "ecommerce-project-eda80",
  storageBucket: "ecommerce-project-eda80.appspot.com",
  messagingSenderId: "555193689458",
  appId: "1:555193689458:web:8b3be9e69bb7ac0d1869eb",
  measurementId: "G-6XB0QJEKK3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

function showSignup() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.remove("d-none");
}

function showLogin() {
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("loginForm").classList.remove("d-none");
}

document.getElementById("showSignupBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showSignup();
});

document.getElementById("showLoginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

function validateEmail(email) {
  return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
}

document
  .getElementById("signupPassword")
  .addEventListener("input", function (e) {
    const password = e.target.value;
    const strengthEl = document.getElementById("strength");
    let strength = "Weak";
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    ) {
      strength = "Strong";
    } else if (password.length >= 6) {
      strength = "Medium";
    }
    strengthEl.textContent = `Password strength: ${strength}`;
  });

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!validateEmail(email)) return alert("Invalid email format.");
  if (password !== confirm) return alert("Passwords do not match.");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: new Date(),
    });

    alert("Signup successful!");
    showLogin();
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!validateEmail(email)) return alert("Invalid email format.");
  if (!password) return alert("Password required.");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { name, email, uid } = docSnap.data();
      localStorage.setItem("auth", JSON.stringify({ uid, email, name }));
      localStorage.setItem("userName", name);
    }

    localStorage.setItem("isLogin", "true");
    alert("Login successful!");
    window.location.href = "/";
  } catch (error) {
    alert("Login Error: " + error.message);
  }
});

onAuthStateChanged(auth, async (user) => {
  const showLoginUser = document.querySelector(".login");
  if (user && showLoginUser) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userName = docSnap.data().name;
      localStorage.setItem("userName", userName);
    }
  } else if (showLoginUser) {
    showLoginUser.innerHTML = `<a href="./auth.html">Login</a>`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        localStorage.removeItem("auth");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userName");
        window.location.href = "/login.html";
      } catch (error) {
        console.error("Logout Error:", error.message);
      }
    });
  }
});
