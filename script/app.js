console.log("E-Commerce Website Loaded");

/**
 * @description navbar shadow
 * @function navbarShadow()
 * @returns scrolling time shadow under navbar
 */

function navbarShadow() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      navbar.classList.add("navbar-shadow");
    } else {
      navbar.classList.remove("navbar-shadow");
    }
  });
}
navbarShadow();

/**
 * @description this is harmburger
 * @function harmburger()
 * @returns get menu icon on mobile view
 */
function hamburger() {
  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-respo");
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  });
}
hamburger();

/**
 * @description this is search icon click
 * @function searchBar()
 * @returns get search input in menu bar
 */
function searchBar() {
  document.addEventListener("DOMContentLoaded", () => {
    const BtnGlass = document.getElementById("magnifyBtn");
    const Search = document.querySelector(".search-item");
    BtnGlass.addEventListener("click", () => {
      Search.classList.toggle("open");
    });
  });
}
searchBar();

/**
 * @description Cart Count
 * @function updateCartCount()
 * @returns update cart value then added item in cart
 */

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountEl = document.getElementById("cart-count");

  if (cart.length > 0) {
    cartCountEl.innerHTML = cart.length;
  } else {
    cartCountEl.innerHTML = 0;
  }
}

// ✅ Call on every page load to show cart count
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

const path = window.location.pathname;
if (path.includes("index.html") || path === "/") {
  const items = document.getElementById("items");
  const loading = document.getElementById("loading");

  function loadProducts() {
    loading.style.display = "block";
    items.innerHTML = "";

    fetch("https://fakestoreapiserver.reactbd.com/walmart")
      .then((response) => response.json())
      .then((data) => {
        loading.style.display = "none";

        if (!data || data.length === 0) {
          items.innerHTML = "<p>No products found.</p>";
          return;
        }

        data.forEach((item) => {
          const image = item.image || item.image?.[0];
          const price = Math.floor(item.price * 80);
          let title = item.title.slice(0, 22);

          const product = document.createElement("div");
          product.className = " col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4";

          product.innerHTML = `
            <div class="item card h-100 text-center position-relative d-flex justify-content-center">
              <div class="card-body p-3">
                <div class="image-cartBtn">
                  <a href='../pages/product.html?id=${item._id}'>
                    <img src="${image}" alt="${item.title}" loading="lazy" class="item-img"/>
                  </a>
                </div>
                <button 
                  class="cart-btn"
                  data-id="${item._id}"
                  data-title="${item.title}"
                  data-price="${price}"
                  data-image="${image}"
                >
                  <span>Add to Cart</span>
                </button>
                <h4 class="my-3">${title}</h4>
                <p class="item-price"><strong>₹${price}</strong></p>
              </div>
            </div>
          `;
          items.appendChild(product);
        });

        attachCartListeners(); // Add listeners after rendering
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        loading.textContent = "Failed to load products.";
      });
  }

  // 🔁 Attach event listeners to all Add to Cart buttons
  function attachCartListeners() {
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const title = this.dataset.title;
        const price = parseFloat(this.dataset.price);
        const image = this.dataset.image;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.id === id);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ id, title, price, image, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
        alert("Item added to cart!");
      });
    });
  }

  loadProducts();
}
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Normalize all ids to string and merge duplicates
let mergedCart = [];

cart.forEach((item) => {
  const id = String(item.id); // normalize id
  const existing = mergedCart.find((i) => String(i.id) === id);

  if (existing) {
    existing.qty = (existing.qty || 1) + (item.qty || 1);
  } else {
    mergedCart.push({
      ...item,
      id, // normalize to string
      qty: item.qty || 1,
    });
  }
});

// Save back to localStorage
localStorage.setItem("cart", JSON.stringify(mergedCart));

/**
 * @description Smooth scroll down to top Button
 * @function goToTopBtn()
 */
function goToTopBtn() {
  document.getElementById("goTopBtn").addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
goToTopBtn();

function showUser() {
  const showLoginUser = document.querySelector(".login");
  const userProfile = document.querySelector(".user-profile");
  const userLog = document.querySelector(".userLog");

  // Get user data from localStorage
  const getUserName = localStorage.getItem("userName");

  // Check if user is logged in
  if (!getUserName) {
    // User not logged in
    showLoginUser.innerHTML = "Login";
    showLoginUser.style.display = "block"; // Show Login button
    userProfile.style.display = "none"; // Hide user profile section
  } else {
    // User is logged in
    showLoginUser.style.display = "none"; // Hide Login button
    userProfile.style.display = "flex"; // Show user profile section
    userLog.innerHTML = `Hi! ${getUserName}`; // Display user name
  }
}
showUser();

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("auth");
      localStorage.removeItem("userName");
      window.location.href = "/";
    });
  }
});

import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
function logoutKey() {
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyDP2TktQJUtRfloWBoKTwlnzEJeRlUSS6M",
    authDomain: "ecommerce-project-eda80.firebaseapp.com",
    projectId: "ecommerce-project-eda80",
    storageBucket: "ecommerce-project-eda80.appspot.com",
    messagingSenderId: "555193689458",
    appId: "1:555193689458:web:8b3be9e69bb7ac0d1869eb",
    measurementId: "G-6XB0QJEKK3",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // DOM elements
  const showLoginUser = document.querySelector(".login");
  const showProfile = document.querySelector(".showProfile");
  const userLog = document.querySelector(".userLog");

  // Show user if logged in
  function showUser() {
    const getUserAuth = JSON.parse(localStorage.getItem("auth"));
    if (!getUserAuth) {
      if (showLoginUser) showLoginUser.innerHTML = "Login";
      if (showProfile) showProfile.style.display = "none";
    } else {
      if (showLoginUser) showLoginUser.style.display = "none";
      if (showProfile) showProfile.style.display = "flex";
      if (userLog) userLog.innerHTML = `Hi! ${getUserAuth.name}`;
    }
  }
  showUser();

  // Listen for auth state and update localStorage if needed
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { name, email, uid } = docSnap.data();
        localStorage.setItem("auth", JSON.stringify({ uid, email, name }));
        localStorage.setItem("isLogin", "true");
        showUser(); // Update UI
      }
    }
  });

  // Logout function
  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await signOut(auth); // Firebase logout
          localStorage.removeItem("auth");
          localStorage.removeItem("userName");
          localStorage.removeItem("isLogin");
          window.location.href = "../pages/auth.html"; // Redirect
        } catch (error) {
          console.error("Logout error:", error.message);
        }
      });
    }
  });
}
logoutKey();
