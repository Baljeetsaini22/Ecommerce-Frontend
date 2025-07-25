import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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

function togglePassword(inputId, spanId) {
  const input = document.getElementById(inputId);
  const span = document.getElementById(spanId);
  if (input.type === "password") {
    input.type = "text";
    span.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
  } else {
    input.type = "password";
    span.innerHTML = `<i class="fa-solid fa-eye"></i>`;
  }
}

document.getElementById("toggleLogin").addEventListener("click", () => {
  togglePassword("loginPassword", "toggleLogin");
});
document.getElementById("toggleSignup").addEventListener("click", () => {
  togglePassword("signupPassword", "toggleSignup");
});

function validateEmail(email) {
  return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("d-none");
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("forgotPasswordForm").classList.add("d-none");
}

function showSignup() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.remove("d-none");
  document.getElementById("forgotPasswordForm").classList.add("d-none");
}

document.getElementById("showSignupBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showSignup();
});

document.getElementById("showLoginBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

document.getElementById("forgotPasswordBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("forgotPasswordForm").classList.remove("d-none");
});

document.getElementById("backToLogin").addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
});

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

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  const mobile = document.getElementById("mobile").value;

  if (!validateEmail(email)) return alert("Invalid email format.");
  if (!/^[6-9]\d{9}$/.test(mobile))
    return alert("Enter valid Indian mobile number.");
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
      mobile,
      createdAt: new Date(),
    });

    alert("Signup successful!");
    window.location.href = "/";
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
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
    window.location.href = "../pages/cart.html";
  } catch (error) {
    alert("Login Error: " + error.message);
  }
});

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;
    if (!validateEmail(email)) return alert("Enter a valid email address.");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent to email. Please check your inbox.");
      showLogin();
    } catch (error) {
      alert("Reset Error: " + error.message);
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
