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
  const cartCountEl = document.querySelector(".cart-count");
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



//   //  if(cart)
//     // count +=  cart[i]
//   }
//   console.log(count)
// cart.map((item) => {
//   let count = 0;
//   console.log(item)
  
// })
// /**
//  * @description this is used for Add to cart items
//  * @returns add items in cart by user
//  * @function addCart()
//  */

// function addCart() {
//   const items = document.querySelector(".items");
//   const loading = document.getElementById("loading");

//   function loadProducts() {
//     loading.style.display = "block";
//     items.innerHTML = "";

//     // fetch("https://dummyjson.com/products")
//     fetch("https://fakestoreapiserver.reactbd.com/walmart")
//       .then((response) => response.json())
//       .then((data) => {
//         // const products = data?.products.slice(0, 16);

//         loading.style.display = "none";

//         if (!products || products.length === 0) {
//           items.innerHTML = "<p>No products found.</p>";
//           return;
//         }
//         data.forEach((item) => {
//           const image = item.image || item.image?.[0];
//           const card = `
//             <div class="item">
//               <div class="item-details">
//                 <div class="image-cartBtn">
//                 <a href='../pages/product.html?id=${item._id}'>
//                   <img src="${image}" alt="${
//             item.title
//           }" loading="lazy" class="item-img"/>
//           </a>
//           </div>
//                 <button class="cart-btn" onclick="addToCart('${item.title.replace(
//                   /'/g,
//                   "\\'"
//                 )}')"><span>Add to Cart</span></button>
//                 <h4 class="item-title">${item.title}</h4>
//                 <p class="item-price"><strong>₹${Math.floor(
//                   item.price * 80
//                 )}</strong></p>
//               </div>
//             </div>
//           `;

//           items.innerHTML += card;
//         });
//       })
//       .catch((err) => {
//         console.error("Error loading products:", err);
//         loading.textContent = "Failed to load products.";
//       });
//   }

//   loadProducts();
// }
// addCart();

// /**
//  * @description This data add to cart
//  */

// function CartItem() {
//   const cart = [];

//   window.addToCart = function (itemName) {
//     const existingItem = cart.find((item) => item.name === itemName);
//     if (existingItem) {
//       existingItem.qty++;
//     } else {
//       cart.push({ name: itemName, qty: 1 });
//     }
//     alert(itemName + " added to cart");
//   };

//   window.showCart = function () {
//     const cartList = document.getElementById("cart-list");
//     cartList.innerHTML = "";

//     if (cart.length === 0) {
//       cartList.innerHTML = "<li>Cart is empty</li>";
//     } else {
//       cart.forEach((item, index) => {
//         const li = document.createElement("li");
//         li.innerHTML = `
//               <span>${item.name} (x${item.qty})</span>
//               <div>
//                 <button onclick="changeQty(${index}, 1)">+</button>
//                 <button onclick="changeQty(${index}, -1)">-</button>
//                 <button onclick="removeItem(${index})">🗑</button>
//               </div>
//             `;
//         cartList.appendChild(li);
//       });
//     }

//     document.getElementById("cart-dialog").style.display = "flex";
//   };

//   window.closeCart = function () {
//     document.getElementById("cart-dialog").style.display = "none";
//   };

//   window.changeQty = function (index, delta) {
//     cart[index].qty += delta;
//     if (cart[index].qty <= 0) {
//       cart.splice(index, 1);
//     }
//     showCart();
//   };

//   window.removeItem = function (index) {
//     cart.splice(index, 1);
//     showCart();
//   };

//   window.confirmOrder = function () {
//     if (cart.length === 0) {
//       alert("Your cart is empty.");
//     } else {
//       alert(
//         "✅ Order Confirmed!\n\n" +
//           cart.map((item) => `${item.name} x${item.qty}`).join("\n")
//       );
//       cart.length = 0;
//       closeCart();
//     }
//   };
// }
// CartItem();
