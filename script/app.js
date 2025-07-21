console.log("E-Commerce Website Loaded");

/**
 * @description navbar shadow
 * @function navbarShadow()
 * @returns scrolling time shadow under navbar
 */
function navbarShadow() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("navbar-shadow", window.scrollY > 0);
  });
}
navbarShadow();

/**
 * @description Hamburger toggle and search toggle
 * @function hamburger()
 * @returns on mobile view click the hamburger to show menu list and maginify glass to show search bar
 */
function mobileToggles() {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hamburger")?.addEventListener("click", () => {
      document.querySelector(".nav-respo")?.classList.toggle("open");
    });
    document.getElementById("magnifyBtn")?.addEventListener("click", () => {
      document.querySelector(".search-item")?.classList.toggle("open");
    });
  });
}
mobileToggles();

/**
 * @description Cart Count
 * @function updateCartCount()
 * @returns update cart value then added item in cart
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerHTML = cart.length;
}
document.addEventListener("DOMContentLoaded", updateCartCount);

// Load Products on Home Page
const path = window.location.pathname;
if (path.includes("index.html") || path === "/") {
  const items = document.getElementById("items");
  const loading = document.getElementById("loading");

  function loadProducts() {
    loading.style.display = "block";
    items.innerHTML = "";

    fetch("https://fakestoreapiserver.reactbd.com/walmart")
      .then((res) => res.json())
      .then((data) => {
        loading.style.display = "none";
        if (!data.length)
          return (items.innerHTML = "<p>No products found.</p>");

        data.forEach((item) => {
          const price = Math.floor(item.price * 80);
          const oldPrice =
            item.oldPrice && !isNaN(item.oldPrice)
              ? Math.floor(item.oldPrice * 80)
              : null;
          const title =
            item.title.length > 22
              ? item.title.slice(0, 22) + "..."
              : item.title;

          const product = document.createElement("div");
          product.className = "col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4";
          product.innerHTML = `
            <div class="item card h-100 text-center position-relative d-flex justify-content-center">
              <div class="card-body p-3">
                <div class="image-cartBtn">
                  <a href='../pages/product.html?id=${item._id}'>
                    <img src="${item.image}" alt="${
            item.title
          }" loading="lazy" class="item-img"/>
                  </a>
                </div>
                <button class="cart-btn" data-id="${item._id}" data-title="${
            item.title
          }" data-oldprice="${
            oldPrice || ""
          }" data-price="${price}" data-image="${item.image}">
                  <span>Add to Cart</span>
                </button>
                <h4 class="my-3">${title}</h4>
                <p>
                ${
                  oldPrice
                    ? `<del class="text-danger">₹${oldPrice}</del> <span class="text-success">₹${price}</span>`
                    : `<span class="text-success fw-bold">₹${price}</span>`
                }
              </p>
              </div>
            </div>`;

          items.appendChild(product);
        });

        attachCartListeners();
      })
      .catch(() => (loading.textContent = "Failed to load products."));
  }

  function attachCartListeners() {
    document.querySelectorAll(".cart-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const { id, title, price, image, oldprice } = button.dataset;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find((item) => item.id === id);

        if (existing) existing.qty += 1;
        else
          cart.push({
            id,
            title,
            oldPrice: parseFloat(oldprice) || null,
            price: parseFloat(price),
            image,
            qty: 1,
          });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert("Item added to cart!");
      });
    });
  }

  loadProducts();
}

(function normalizeCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const merged = [];

  cart.forEach((item) => {
    const id = String(item.id);
    const existing = merged.find((i) => i.id === id);
    if (existing) existing.qty += item.qty || 1;
    else merged.push({ ...item, id, qty: item.qty || 1 });
  });

  localStorage.setItem("cart", JSON.stringify(merged));
})();

/**
 * @description Smooth scroll down to top Button
 * @function goToTopBtn()
 * @returns if we are on footer to click gototop button reach top of page
 */
function goToTopBtn() {
  document.getElementById("goTopBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
goToTopBtn();

/**
 * @description login and Show username in navbar
 * @function showUser()
 * @returns if show login or hide username & else show username or hide login
 */
function showUser() {
  const showLoginUser = document.querySelector(".login");
  const userProfile = document.querySelector(".user-profile");
  const userLog = document.querySelector(".userLog");
  const getUserName =
    localStorage.getItem("userName") ||
    JSON.parse(localStorage.getItem("auth"))?.name;

  if (!getUserName) {
    showLoginUser.innerHTML = "Login";
    showLoginUser.style.display = "block";
    userProfile.style.display = "none";
  } else {
    showLoginUser.style.display = "none";
    userProfile.style.display = "flex";
    userLog.innerHTML = `Hi! ${getUserName}`;
  }
}
showUser();

// Firebase Auth Integration
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { name, email, uid } = docSnap.data();
      localStorage.setItem("auth", JSON.stringify({ uid, email, name }));
      localStorage.setItem("isLogin", "true");
      showUser();
    }
  }
});

/**
 * @description logout button in userprfile toggle
 * @function handleLogout()
 * @returns if user login to logout our account
 */

function handleLogout() {
  const logoutBtn = document.getElementById("logout");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      ["auth", "userName", "isLogin"].forEach((key) =>
        localStorage.removeItem(key)
      );
      window.location.href = "../pages/auth.html";
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  });
}
document.addEventListener("DOMContentLoaded", handleLogout);
