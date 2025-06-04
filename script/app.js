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
  const url = "https://dummyjson.com/products";

  const itemDetails = document.createElement("div");
  itemDetails.className = "item";

  let fetched = [];

  async function getData() {
    const getUrl = await fetch(url);
    const data = await getUrl.json();
    fetched = data?.products;
    fetched.slice(0, 16).forEach((item) => {
      const items = document.querySelector(".items");
      const image = item.images?.[0];

      const card = `
        <div class="item">
          <div class="item-details">
            <div class="add-cartBtn">
              <img src ="${image}" alt="${item.title}" class="item-img"/>
              <input type="submit" value="Add to Cart" class="cart-btn" />
            </div>
            <h4 class="item-title">${item?.title}</h4>
            <span class="item-price">₹${Math.floor(item.price * 80)}</span>
          </div>
        </div>
        `;
      items.innerHTML += card;
    });
  }
  getData();
}
addCart();

/**
 * @description This data add to cart
 */

function CartItem() {
  
}

CartItem()
