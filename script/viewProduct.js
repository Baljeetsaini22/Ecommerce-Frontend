const path = window.location.pathname;
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in UI
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountEl.textContent = cart.length;

  // Load products if on product view page
  if (path.includes("/pages/productsView.html")) {
    loadProducts();
  }
}

// Display products from API
function loadProducts() {
  const waiting = document.getElementById("waiting");
  const container = document.getElementById("itemShow");
  waiting.style.display = "block";
  container.innerHTML = "";

  fetch("/product.json")
    .then((res) => res.json())
    .then((data) => {
      waiting.style.display = "none";

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
      }

      data.forEach((item) => {
        const newPrice = Number(item.price.toString().replace(/,/g, ""));
        const priceOld = Number(item.oldPrice.toString().replace(/,/g, ""));
        const title =
          item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

        const card = document.createElement("div");
        card.className = "col-sm-6 col-md-6 col-lg-4 mb-4";

        card.innerHTML = `
          <div class="item card h-100 text-center">
            <div class="card-body p-3">
              <div class="image-cartBtn">
                <a href='../pages/product.html?id=${
                  item._id
                }'class="image-cartBtn">
                  <img src="${item.image}" alt="${
          item.title
        }" loading="lazy" class="item-img" />
                </a>
              </div>
              <div style="min-height: 80px;">
              <button 
                class="cart-btn btn btn-sm mt-2"
                data-id="${item._id}"
                data-title="${item.title}"
                data-oldprice="${priceOld || ""}"
                data-price="${newPrice}"
                data-image="${item.image}"
              >
                <span>Add to Cart</span>
              </button>
              <h4 class="my-2 text-truncate" style="max-width: 100%;">${title}</h4>
              <p>
                ${
                  priceOld
                    ? `<del class="text-danger">₹${priceOld}</del> <span class="text-success">₹${newPrice}</span>`
                    : `<span class="text-success fw-bold">₹${newPrice}</span>`
                }
              </p>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

      attachCartListeners();
    })
    .catch((err) => {
      console.error("Error loading products:", err);
      waiting.textContent = "Failed to load products.";
    });
}

// Attach "Add to Cart" button logic
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
          oldPrice: oldprice,
          price: price,
          image,
          qty: 1,
        });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert("Item added to cart!");
    });
  });
}

document.addEventListener("DOMContentLoaded", updateCartCount);

// const path = window.location.pathname;
// const cart = JSON.parse(localStorage.getItem("cart")) || [];

// // Update cart count in UI
// function updateCartCount() {
//   const cartCountEl = document.getElementById("cart-count");
//   cartCountEl.textContent = cart.length > 0 ? cart.length : 0;
// }

// // Display products from API
// function loadProducts() {
//   const waiting = document.getElementById("waiting");
//   const container = document.getElementById("itemShow");
//   waiting.style.display = "block";
//   container.innerHTML = "";

//   fetch("https://fakestoreapiserver.reactbd.com/walmart")
//     .then((res) => res.json())
//     .then((data) => {
//       waiting.style.display = "none";

//       if (!data || data.length === 0) {
//         container.innerHTML = "<p>No products found.</p>";
//         return;
//       }

//       data.forEach((item) => {
//         const image = item.image || item.image?.[0];
//         const price = Math.floor(item.price * 80);
//         const oldPrice =
//           item.oldPrice &&
//           !isNaN(item.oldPrice) &&
//           Number(item.oldPrice) * 80 > price
//             ? Math.floor(Number(item.oldPrice) * 80)
//             : null;
//         const title =
//           item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

//         const card = document.createElement("div");
//         card.className = "col-sm-6 col-md-6 col-lg-4 mb-4";

//         card.innerHTML = `
//           <div class="item card h-100 text-center">
//             <div class="card-body p-3">
//               <div class="image-cartBtn">
//                 <a href='../pages/product.html?id=${item._id}'>
//                   <img src="${image}" alt="${
//           item.title
//         }" loading="lazy" class="item-img"/>
//                 </a>
//               </div>
//               <button
//                 class="cart-btn btn btn-sm btn-outline-primary mt-2"
//                 data-id="${item._id}"
//                 data-title="${item.title}"
//                 data-oldprice="${oldPrice !== null ? oldPrice : ""}"
//                 data-price="${price}"
//                 data-image="${image}"
//               >
//                 <span>Add to Cart</span>
//               </button>
//               <h5 class="my-3">${title}</h5>
//               <p>
//                 ${
//                   oldPrice
//                     ? `<del class="text-danger">₹${oldPrice}</del> <span class="text-success">₹${price}</span>`
//                     : `<span class="text-success fw-bold">₹${price}</span>`
//                 }
//               </p>
//             </div>
//           </div>
//         `;

//         container.appendChild(card);
//       });

//       attachCartListeners();
//     })
//     .catch((err) => {
//       console.error("Error loading products:", err);
//       waiting.textContent = "Failed to load products.";
//     });
// }

// // Attach "Add to Cart" button logic
// function attachCartListeners() {
//   const buttons = document.querySelectorAll(".cart-btn");

//   buttons.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       const id = btn.dataset.id;
//       const title = btn.dataset.title;
//       const price = parseFloat(btn.dataset.price);
//       const image = btn.dataset.image;
//       const oldPriceRaw = btn.dataset.oldprice;
//       const oldPrice =
//         oldPriceRaw && !isNaN(oldPriceRaw) ? parseFloat(oldPriceRaw) : null;

//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       const existing = cart.find((item) => item.id === id);

//       if (existing) {
//         existing.qty += 1;
//       } else {
//         cart.push({ id, title, price, oldPrice, image, qty: 1 });
//       }

//       localStorage.setItem("cart", JSON.stringify(cart));
//       updateCartCount();
//       window.location.reload();
//       alert("Item added to cart!");
//     });
//   });
// }

// // Run on page load
// document.addEventListener("DOMContentLoaded", () => {
//   updateCartCount();

//   // Only run product loading if on correct page
//   if (path.includes("productsView.html")) {
//     loadProducts();
//   }
// });
