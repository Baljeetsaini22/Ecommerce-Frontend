const path = window.location.pathname;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.innerText = totalCount;
}

// ✅ Call on every page load to show cart count
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
/**
 * @description this page for item details
 * @returns Full details of Products and add to cart
 * @function ProductDetails()
 */

if (path.includes("product.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  let quantity = 1;

  function ProductDetails() {
    fetch("https://fakestoreapiserver.reactbd.com/walmart")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((item) => String(item._id) === productId);
        if (!product) {
          return (document.getElementById("product-container").innerText =
            "Product not found.");
        }

        const discountPercent = product.oldPrice
          ? Math.round(((product.price - product.oldPrice) / product.oldPrice) * 100)
          : 0;
        const unitPriceINR = Math.floor(product.price * 80);
        const mrpINR = Math.floor((product.oldPrice || product.price) * 80);

        document.getElementById("product-container").innerHTML = `
          <div class="about-product"> 
            <div class="product-img">
              <img src="${product.image}" alt="${product.title}" width="150" />
            </div>
            <div class="description">
              <h2>${product.des}</h2>
              <div class="price">              
                <p><span class="lessPrice">${discountPercent}% off </span> ₹${unitPriceINR}</p>
                <span>M.R.P.: <del>₹${mrpINR}</del></span>
              </div>
              <div class="quantity-control">
                <button class="btnincDec" id="decreaseBtn">-</button>
                <span id="quantity">1</span>
                <button class="btnincDec" id="increaseBtn">+</button>
              </div>
              <p>Total: ₹<span id="totalPrice">${unitPriceINR}</span></p>
              <button id="addToCartBtn" class="cart-btn">
                <span>Add to Cart</span>
              </button>
              <hr/>
              <div class="otherDetails">
                <p><strong>Title:</strong> ${product.title}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Category:</strong> ${product.category}</p>
              </div>
            </div>
          </div>
        `;

        // Element refs
        const qtyEl = document.getElementById("quantity");
        const totalEl = document.getElementById("totalPrice");
        const incBtn = document.getElementById("increaseBtn");
        const decBtn = document.getElementById("decreaseBtn");
        const cartBtn = document.getElementById("addToCartBtn");

        // Update total price
        function updateTotal() {
          qtyEl.innerText = quantity;
          totalEl.innerText = unitPriceINR * quantity;
        }

        incBtn.addEventListener("click", () => {
          quantity++;
          updateTotal();
        });

        decBtn.addEventListener("click", () => {
          if (quantity > 1) {
            quantity--;
            updateTotal();
          }
        });

        // ✅ Add to cart with all product info
        cartBtn.addEventListener("click", () => {
          const id = product._id;
          const title = product.title;
          const price = unitPriceINR;
          const image = product.image;

          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find((item) => item.id === id);

          if (existing) {
            existing.qty += quantity;
          } else {
            cart.push({ id, title, price, image, qty: quantity });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Product added to cart!");
        });
        updateCartCount();
          
      })
      .catch((err) => {
        console.error(err);
        document.getElementById("product-container").innerText =
          "Failed to load product.";
      });
  }

  ProductDetails();
}


// if (path.includes("product.html")) {
//   const urlParams = new URLSearchParams(window.location.search);
//   const productId = urlParams.get("id");
//   let quantity = 1; // <- changed to let

//   function ProductDetails() {
//     fetch("https://fakestoreapiserver.reactbd.com/walmart")
//       .then((res) => res.json())
//       .then((data) => {
//         const product = data.find((item) => String(item._id) === productId);
//         if (!product) {
//           return (document.getElementById("product-container").innerText =
//             "Product not found.");
//         }

//         // Compute display prices
//         const discountPercent = product.oldPrice
//           ? Math.round(
//               ((product.price - product.oldPrice) / product.oldPrice) * 100
//             )
//           : 0;
//         const unitPriceINR = Math.floor(product.price * 80);
//         const mrpINR = Math.floor((product.oldPrice || product.price) * 80);

//         // Render
//         document.getElementById("content").innerHTML = `
//         <div class="about-product"> 
//             <div class="product-img">
//               <img src="${product.image}" alt="${product.title}" width="150" />
//             </div>
//             <div class="description">
//               <h2>${product.des}</h2>
//               <div class="price">              
//                 <p><span class="lessPrice">${discountPercent}% off </span> ₹${unitPriceINR}</p>
//                 <span>M.R.P.: <del>₹${mrpINR}</del></span>
//               </div>
//               <div class="quantity-control">
//                 <button class="btnincDec" id="decreaseBtn">-</button>
//                 <span id="quantity">1</span>
//                 <button class="btnincDec" id="increaseBtn">+</button>
//               </div>
//               <p>Total: ₹<span id="totalPrice">${unitPriceINR}</span></p>
//               <button id="addToCartBtn" class="cart-btn">
//                 <span>Add to Cart</span>
//               </button>
//               <hr/>
//               <div class="otherDetails">
//                 <p><strong>Title:</strong> ${product.title}</p>
//                 <p><strong>Brand:</strong> ${product.brand}</p>
//                 <p><strong>Category:</strong> ${product.category}</p>
//               </div>
//             </div>
//           </div>
//       `;

//         const qtyEl = document.getElementById("quantity");
//         const totalEl = document.getElementById("totalPrice");
//         const incBtn = document.getElementById("increaseBtn");
//         const decBtn = document.getElementById("decreaseBtn");
//         const cartBtn = document.getElementById("addToCartBtn");

//         function updateTotal() {
//           qtyEl.innerText = quantity;
//           totalEl.innerText = unitPriceINR * quantity;
//         }

//         incBtn.addEventListener("click", () => {
//           quantity++;
//           updateTotal();
//         });

//         decBtn.addEventListener("click", () => {
//           if (quantity > 1) {
//             quantity--;
//             updateTotal();
//           }
//         });

//         cartBtn.addEventListener("click", () => {
//           addToCart(product._id, quantity);
//         });
//         attachCartListeners()
//       })
//       .catch((err) => {
//         console.error(err);
//         document.getElementById("product-container").innerText =
//           "Failed to load product.";
//       });
//   }
//   function attachCartListeners() {
//     const cartButtons = document.querySelectorAll(".cart-btn");

//     cartButtons.forEach((button) => {
//       button.addEventListener("click", function () {
//         const id = this.dataset.id;
//         const title = this.dataset.title;
//         const price = parseFloat(this.dataset.price);
//         const image = this.dataset.image;

//         let cart = JSON.parse(localStorage.getItem("cart")) || [];

//         const existing = cart.find((item) => item.id === id);

//         if (existing) {
//           existing.qty += 1;
//         } else {
//           cart.push({ id, title, price, image, qty: 1 });
//         }

//         localStorage.setItem("cart", JSON.stringify(cart));
//         alert("Item added to cart!");
//       });
//     });
//   }
//   ProductDetails();
// }
