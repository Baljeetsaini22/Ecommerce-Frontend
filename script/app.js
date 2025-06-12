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

/**
 * @description this is used for Add to cart items
 * @returns add items in cart by user
 * @function addCart()
 */

function addCart() {
  const items = document.querySelector(".items");
  const loading = document.getElementById("loading");

  function loadProducts() {
    loading.style.display = "block";
    items.innerHTML = "";

    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        const products = data?.products.slice(0, 16);

        loading.style.display = "none";

        if (!products || products.length === 0) {
          items.innerHTML = "<p>No products found.</p>";
          return;
        }
        products.forEach((item) => {
          const image = item.thumbnail || item.images?.[0];
          const card = `
            <div class="item">
              <div class="item-details">
                <div class="image-cartBtn">
                  <img src="${image}" alt="${
            item.title
          }" loading="lazy" class="item-img"/>
                  <button class="go-items" )" class="cart-btn"><span>Add to Cart</span></button>
                  
                </div>
                <h4 class="item-title" onclick="addToCart(${item.title}>${
            item.title
          }</h4>
                <p class="item-price"><strong>₹${Math.floor(
                  item.price * 80
                )}</strong></p>
              </div>
            </div>
          `;

          items.innerHTML += card;
        });
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        loading.textContent = "Failed to load products.";
      });
  }

  loadProducts();
}
addCart();

/**
 * @description This data add to cart
 */

function CartItem() {
  const cart = [];

  window.addToCart = function (itemName) {
    const existingItem = cart.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({ name: itemName, qty: 1 });
    }
    alert(itemName + " added to cart");
  };

  window.showCart = function () {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";

    if (cart.length === 0) {
      cartList.innerHTML = "<li>Cart is empty</li>";
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
              <span>${item.name} (x${item.qty})</span>
              <div>
                <button onclick="changeQty(${index}, 1)">+</button>
                <button onclick="changeQty(${index}, -1)">-</button>
                <button onclick="removeItem(${index})">🗑</button>
              </div>
            `;
        cartList.appendChild(li);
      });
    }

    document.getElementById("cart-dialog").style.display = "flex";
  };

  window.closeCart = function () {
    document.getElementById("cart-dialog").style.display = "none";
  };

  window.changeQty = function (index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    showCart();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    showCart();
  };

  window.confirmOrder = function () {
    if (cart.length === 0) {
      alert("Your cart is empty.");
    } else {
      alert(
        "✅ Order Confirmed!\n\n" +
          cart.map((item) => `${item.name} x${item.qty}`).join("\n")
      );
      cart.length = 0;
      closeCart();
    }
  };
}
CartItem();
