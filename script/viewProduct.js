const path = window.location.pathname;
const cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
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

if (path.includes("productsView.html")) {
  const itemShow = document.querySelectorAll(".itemShow");
  const waiting = document.getElementById("waiting");

  function productsLoad() {
    waiting.style.display = "block";
    itemShow.innerHTML = "";

    fetch("https://fakestoreapiserver.reactbd.com/walmart")
      .then((response) => response.json())
      .then((data) => {
        waiting.style.display = "none";

        if (!data || data.length === 0) {
          itemShow.innerHTML = "<p>No products found.</p>";
          return;
        }

        const container = document.getElementById("itemShow");
        data.map((item) => {
          const image = item.image || item.image?.[0];
          const price = Math.floor(item.price * 80);

          let title =
            item.title.length > 22 ? item.title.slice(0, 22) : item.title;

          let priceOld = null;
          if (item.oldPrice) {
            const convertedOld = Math.floor(Number(item.oldPrice) * 80);
            if (convertedOld > price) {
              priceOld = convertedOld;
            }
          }
          if (
            item.oldPrice !== undefined &&
            !isNaN(item.oldPrice) &&
            Number(item.oldPrice) > price
          ) {
            priceOld = Math.floor(Number(item.oldPrice) * 80);
          }

          const showPrice = priceOld
            ? `<p><del>₹${priceOld}</del>: ₹${price}</p>`
            : `<p>₹${price}</p>`;

          const productDiv = document.createElement("div");
          productDiv.className = " col-sm-6 col-md-6 col-lg-4 mb-4";

          productDiv.innerHTML = `
          <div class="item card h-100 text-center">
            <div class="card-body p-3">
              <div class="image-cartBtn">
                <a href='../pages/product.html?id=${item._id}'>
                  <img src="${image}" alt="${
            item.title
          }" loading="lazy" class="item-img"/>
                </a>
              </div>
              <button 
                class="cart-btn"
                data-id="${item._id}"
                data-title="${item.title}"
                data-oldprice="${priceOld !== null ? priceOld : ""}"
                data-price="${price}"
                data-image="${image}"
              >
                <span>Add to Cart</span>
              </button>
              <h4 class="my-3">${title}</h4>
              <p>${showPrice}</p>
            </div>
            </div>
          `;
          container.appendChild(productDiv);
        });
        attachCartListeners();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        waiting.textContent = "Failed to load products.";
      });
  }
  function attachCartListeners() {
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const title = this.dataset.title;
        const price = parseFloat(this.dataset.price);
        const image = this.dataset.image;
        const oldPriceRaw = this.dataset.oldprice;
        const oldPrice =
          oldPriceRaw && !isNaN(oldPriceRaw) ? parseFloat(oldPriceRaw) : null;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.id === id);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ id, title, oldPrice, price, image, qty: 1 });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload()
        updateCartCount();
        alert("Item added to cart!");
      });
    });
  }
  productsLoad();
}
