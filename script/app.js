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
 * @description login and Show username in navbar
 * @function showUser()
 * @returns if show login or hide username & else show username or hide login
 */
function showUser() {
  const showLoginUser = document.querySelector(".login");
  const userProfile = document.getElementById("userName");
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

/**
 * @description show Product to show in input search bar
 * @function inputSearch()
 * @returns get item search by name
 */

function inputSearch() {
  const searchBar = document.getElementById("searchItem");
  const ShowCatalog = document.querySelector(".showItem");
  const ShowDialog = document.querySelector(".search-item");

  let productData = [];

  fetch("/product.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.slice(0, 12);
      productData = product;
    });

  ShowDialog.addEventListener("click", function (e) {
    e.stopPropagation();
    ShowCatalog.style.display = "flex";
  });

  document.addEventListener("click", function (e) {
    if (!ShowDialog.contains(e.target)) {
      ShowCatalog.style.display = "none";
    }
  });

  searchBar.addEventListener("input", function (e) {
    const invalue = e.target.value.trim().toLowerCase();

    if (!invalue) {
      ShowCatalog.innerHTML =
        "<p class='text-muted px-2 py-1'>Search product by name</p>";
      return;
    }

    const filtered = productData.filter((item) =>
      item.title.toLowerCase().includes(invalue)
    );

    if (!filtered.length) {
      ShowCatalog.innerHTML =
        "<p class='text-danger px-2 py-1'>No products found.</p>";
      return;
    }

    ShowCatalog.innerHTML = filtered
      .map((item) => {
        const shortTitle =
          item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

        return `
          <div class=" d-flex align-items-center mb-2 border-bottom border-dark border-opacity-25">
            <a href="../pages/product.html?id=${item._id}" class="d-flex align-items-center text-decoration-none text-dark w-100">
              <img src="${item.image}" alt="${item.title}" class="searchImg me-2" />
              <div>
                <p class="mb-0 fw-semibold">${shortTitle}</p>
                <span>₹${item.oldPrice}</span>
              </div>
            </a>
          </div>`;
      })
      .join("");
  });
}
inputSearch();

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

/**
 * @description silder for hero section
 * @function heroSlider()
 * @returns Automatic change image in slide 5 second on hero section
 */
function heroSlider() {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 5000);
}
heroSlider();

/**
 * @description Fetch product form api Product.json
 * @function loadProducts()
 * @returns Give product list in dom
 */

const path = window.location.pathname;
if (path.includes("index.html") || path === "/") {
  const items = document.getElementById("items");
  const loading = document.getElementById("loading");

  function loadProducts() {
    loading.style.display = "block";
    items.innerHTML = "";

    fetch("/product.json")
      .then((res) => res.json())
      .then((data) => {
        loading.style.display = "none";
        if (!data.length)
          return (items.innerHTML = "<p>No products found.</p>");

        data.forEach((item) => {
          const image = item.image || [];
          const mainImage = Array.isArray(image) && image.length > 0 ? image[0] : "";
          const newPrice = Number(item.price.toString().replace(/,/g, ""));
          const prePrice = Number(item.oldPrice.toString().replace(/,/g, ""));
          const title =
            item.title.length > 22
              ? item.title.slice(0, 22) + "..."
              : item.title;

          const product = document.createElement("div");
          product.className = "col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4";
          product.innerHTML = `
            <div class="item card h-100 text-center">
              <a href='../pages/product.html?id=${
                item._id
              }' class="card-body text-black p-3">
                <div class="d-flex flex-column gap-2 justify-content-between">
                  <div class="image-cartBtn">
                    <img src="${mainImage}" alt="${item.title}" loading="lazy"
                        class="item-img" />
                  </div>
                  <div style="min-height: 80px;">
                    <h4 class="my-2 text-truncate" style="max-width: 100%;">${title}</h4>
                    <p class="mb-0">
                      ${
                        prePrice
                          ? `<del class="text-danger">₹${prePrice}</del> <span class="text-success">₹${newPrice}</span>`
                          : `<span class="text-success fw-bold">₹${newPrice}</span>`
                      }
                    </p>
                  </div>
                </div>
              </a>
            </div>`;

          items.appendChild(product);
        });

        attachCartListeners();
      })
      .catch(() => (loading.textContent = "Failed to load products."));
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
      // localStorage.setItem("auth", JSON.stringify({ uid, email, name }));
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
