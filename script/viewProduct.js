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
    const Image = item.image || [];
    const mainImage = Array.isArray(Image) && Image.length > 0 ? Image[0] : "";
    const newPrice = Number(item.price.toString().replace(/,/g, ""));
    const priceOld = Number(item.oldPrice?.toString().replace(/,/g, "")) || null;
    const title = item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-6 col-lg-4 mb-4";
    col.innerHTML = `
      <div class="item card h-100 text-center">
        <div class="card-body p-3">              
          <a href='../pages/product.html?id=${item._id}' class="image-cartBtn">
            <img src="${mainImage}" alt="${item.title}" loading="lazy" class="item-img" />
          </a>
          <div style="min-height: 80px;">
            <button 
              class="cart-btn btn btn-sm mt-2"
              data-id="${item._id}"
              data-title="${item.title}"
              data-oldprice="${priceOld || ""}"
              data-price="${newPrice}"
              data-image="${mainImage}"
              data-size='${item.size ? item.size[0] || "" : ""}'
              data-color='${item.color ? item.color[0] || "" : ""}'
              data-storage='${item.storage ? item.storage[0] || "" : ""}'
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
  const selectedCategories = Array.from(document.querySelectorAll(".filter-category"))
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const selectedPrice = parseInt(priceRange.value);

  const filtered = allProducts.filter((product) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const price = Number(product.price.toString().replace(/,/g, ""));
    return categoryMatch && price <= selectedPrice;
  });

  renderProducts(filtered);
}

function attachCartListeners() {
  document.querySelectorAll(".cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { id, title, price, image, oldprice, size, color, storage } = button.dataset;
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.find((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color &&
        item.storage === storage
      );

      if (exists) {
        exists.qty += 1;
      } else {
        cart.push({
          id,
          title,
          price,
          oldPrice: oldprice,
          image,
          qty: 1,
          size: size || "",
          color: color || "",
          storage: storage || ""
        });
      }

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

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});

categoryCheckboxes.forEach((cb) => cb.addEventListener("change", filterProducts));
priceRange.addEventListener("input", () => {
  priceValue.textContent = priceRange.value;
  filterProducts();
});