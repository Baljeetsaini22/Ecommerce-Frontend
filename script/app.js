console.log("E-Commerce Website Loaded");
/**
 * @description this is harmburger
 * @returns get menu icon on mobile view
 * @function harmburger()
 */
function hamburger() {
  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.querySelector(".nav-menu");
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  });
}
hamburger();

/**
 * @description this is search icon click
 * @returns get search input in menu bar
 * @function searchBar()
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
 * @description this used for scroll behavior
 * @returns go smooth scrool links menus
 * @function smoothBehavior()
 */
function smoothBehavior() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}
smoothBehavior();

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountEl = document.getElementById("cart-count");
  if(cart.length > 0){
    cartCountEl.innerHTML = cart.length;;
  }else{
    cartCountEl.innerHTML = 0;
  }
}

// ✅ Call on every page load to show cart count
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

const path = window.location.pathname;
if (path.includes("index.html") || path === "/") {
  const items = document.querySelector(".items");
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

          const card = `
            <div class="item">
              <div class="item-details">
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
                <h4 class="item-title">${item.title}</h4>
                <p class="item-price"><strong>₹${price}</strong></p>
              </div>
            </div>
          `;
          items.innerHTML += card;
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

cart.forEach(item => {
  const id = String(item.id); // normalize id
  const existing = mergedCart.find(i => String(i.id) === id);

  if (existing) {
    existing.qty = (existing.qty || 1) + (item.qty || 1);
  } else {
    mergedCart.push({
      ...item,
      id, // normalize to string
      qty: item.qty || 1
    });
  }
});

// Save back to localStorage
localStorage.setItem("cart", JSON.stringify(mergedCart));