const path = window.location.pathname;
const cartCountEl = document.getElementById("cart-count");
const itemShow = document.getElementById("itemShow");
const waiting = document.getElementById("waiting");
const categoryCheckboxes = document.querySelectorAll(".filter-category");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
let allProducts = [];

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountEl.textContent = cart.length;
}

function renderProducts(products) {
  itemShow.innerHTML = "";
  if (!products.length) {
    itemShow.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((item) => {
    const newPrice = Number(item.price.toString().replace(/,/g, ""));
    const priceOld =
      Number(item.oldPrice?.toString().replace(/,/g, "")) || null;
    const title =
      item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-6 col-lg-4 mb-4";

    col.innerHTML = `
          <div class="item card h-100 text-center">
            <div class="card-body p-3">              
              <a href='../pages/product.html?id=${
                item._id
              }'class="image-cartBtn">
                <img src="${item.image}" alt="${
      item.title
    }" loading="lazy" class="item-img" />
              </a>
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
    itemShow.appendChild(col);
  });

  attachCartListeners();
}

function filterProducts() {
  const selectedCategories = Array.from(
    document.querySelectorAll(".filter-category")
  )
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const selectedPrice = parseInt(document.getElementById("priceRange").value);

  const filtered = allProducts.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const price = Number(product.price.toString().replace(/,/g, ""));
    const priceMatch = price <= selectedPrice;
    return categoryMatch && priceMatch;
  });

  renderProducts(filtered);
}

function attachCartListeners() {
  document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { id, title, price, image, oldprice } = button.dataset;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.find((item) => item.id === id);

      if (exists) exists.qty += 1;
      else cart.push({ id, title, price, oldPrice: oldprice, image, qty: 1 });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert("Item added to cart!");
    });
  });
}

function loadProducts() {
  fetch("/product.json")
    .then((res) => res.json())
    .then((data) => {
      allProducts = data;
      waiting.style.display = "none";
      renderProducts(allProducts);
    })
    .catch((err) => {
      console.error("Error:", err);
      waiting.textContent = "Failed to load products.";
    });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});

categoryCheckboxes.forEach((cb) =>
  cb.addEventListener("change", filterProducts)
);
priceRange.addEventListener("input", () => {
  priceValue.textContent = priceRange.value;
  filterProducts();
});

// const path = window.location.pathname;
// const cart = JSON.parse(localStorage.getItem("cart")) || [];

// // Update cart count in UI
// function updateCartCount() {
//   const cartCountEl = document.getElementById("cart-count");
//   const cart = JSON.parse(localStorage.getItem("cart")) || [];
//   cartCountEl.textContent = cart.length;

//   // Load products if on product view page
//   if (path.includes("/pages/productsView.html")) {
//     loadProducts();
//   }
// }

// // Display products from API
// function loadProducts() {
//   const waiting = document.getElementById("waiting");
//   const container = document.getElementById("itemShow");
//   waiting.style.display = "block";
//   container.innerHTML = "";

//   fetch("/product.json")
//     .then((res) => res.json())
//     .then((data) => {
//       waiting.style.display = "none";

//       if (!data || data.length === 0) {
//         container.innerHTML = "<p>No products found.</p>";
//         return;
//       }

//       data.forEach((item) => {
//         const newPrice = Number(item.price.toString().replace(/,/g, ""));
//         const priceOld = Number(item.oldPrice.toString().replace(/,/g, ""));
//         const title =
//           item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

//         const card = document.createElement("div");
//         card.className = "col-sm-6 col-md-6 col-lg-4 mb-4";

//         card.innerHTML = `
//           <div class="item card h-100 text-center">
//             <div class="card-body p-3">
//               <div class="image-cartBtn">
//                 <a href='../pages/product.html?id=${
//                   item._id
//                 }'class="image-cartBtn">
//                   <img src="${item.image}" alt="${
//           item.title
//         }" loading="lazy" class="item-img" />
//                 </a>
//               </div>
//               <div style="min-height: 80px;">
//               <button
//                 class="cart-btn btn btn-sm mt-2"
//                 data-id="${item._id}"
//                 data-title="${item.title}"
//                 data-oldprice="${priceOld || ""}"
//                 data-price="${newPrice}"
//                 data-image="${item.image}"
//               >
//                 <span>Add to Cart</span>
//               </button>
//               <h4 class="my-2 text-truncate" style="max-width: 100%;">${title}</h4>
//               <p>
//                 ${
//                   priceOld
//                     ? `<del class="text-danger">₹${priceOld}</del> <span class="text-success">₹${newPrice}</span>`
//                     : `<span class="text-success fw-bold">₹${newPrice}</span>`
//                 }
//               </p>
//               </div>
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
//   document.querySelectorAll(".cart-btn").forEach((button) => {
//     button.addEventListener("click", () => {
//       const { id, title, price, image, oldprice } = button.dataset;
//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       const existing = cart.find((item) => item.id === id);

//       if (existing) existing.qty += 1;
//       else
//         cart.push({
//           id,
//           title,
//           oldPrice: oldprice,
//           price: price,
//           image,
//           qty: 1,
//         });

//       localStorage.setItem("cart", JSON.stringify(cart));
//       updateCartCount();
//       alert("Item added to cart!");
//     });
//   });
// }

// document.addEventListener("DOMContentLoaded", updateCartCount);

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
