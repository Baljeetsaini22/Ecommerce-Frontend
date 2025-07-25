const path = window.location.pathname;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  cartCountEl.innerHTML = cart.length > 0 ? cart.length : 0;
}
document.addEventListener("DOMContentLoaded", updateCartCount);

if (path.includes("product.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  let quantity = 1;

  function ProductDetails() {
    fetch("/product.json")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((item) => item._id === productId);
        if (!product) {
          document.getElementById("product-container").innerText =
            "Product not found.";
          return;
        }

        const colors = product.color || [];
        const sizes = product.size || [];
        const storages = product.storage || [];
        const showSize = Array.isArray(sizes) && sizes.length > 0;
        const showStorage =
          !showSize && Array.isArray(storages) && storages.length > 0;

        const price = Number(product.price.replace(/,/g, ""));
        const oldPrice = Number(product.oldPrice.replace(/,/g, ""));
        const discount =
          oldPrice && price
            ? Math.floor(((oldPrice - price) / oldPrice) * 100)
            : 0;

        const allImages = [...product.image, ...(product.subImage || [])];

        document.getElementById("product-container").innerHTML = `
          <div class="about-product row g-4">
            <div class="col-md-6 product-img">
              <img id="mainImage" src="${
                product.image[0]
              }" class="img-fluid border mb-3 main-img"
                alt="Main Image" style="max-height: 400px; object-fit: contain;" />
              <div id="subImages" class="d-flex flex-wrap gap-2"></div>
            </div>
            <div class="col-md-6 description">
              <h2>${product.title}</h2>
              <div class="price">
                <span class="lessPrice text-danger">${
                  discount ? `-${discount}%` : ""
                }</span>
                <p>
                  ${
                    oldPrice
                      ? `<del class="text-danger">₹${oldPrice}</del> 
                         <span class="text-success fw-bold">₹${price}</span>`
                      : `<span class="text-success fw-bold">₹${price}</span>`
                  }
                </p>
              </div>

              <div class="quantity-control my-2">
                <button class="btnincDec btn btn-outline-secondary" id="decreaseBtn">-</button>
                <span id="quantity" class="mx-2">1</span>
                <button class="btnincDec btn btn-outline-secondary" id="increaseBtn">+</button>
              </div>

              <a href="../pages/cart.html" id="addToCartBtn" class="cart-btn btn btn-primary my-2">
                <span>Add to Cart</span>
              </a>
              <hr/>
              <div class="prod-ablity">
                ${
                  showSize
                    ? `<p>Size:
                        <span class="d-inline-flex flex-wrap gap-2">
                          ${sizes
                            .map(
                              (s, i) => `
                            <input type="radio" class="btn-check" name="size" id="size-${i}" value="${s}" autocomplete="off" ${
                                i === 0 ? "checked" : ""
                              }>
                            <label class="btn btn-outline-primary" for="size-${i}">${s}</label>
                          `
                            )
                            .join("")}
                        </span>
                      </p>`
                    : showStorage
                    ? `<p>Storage:
                        <span class="d-inline-flex flex-wrap gap-2">
                          ${storages
                            .map(
                              (st, i) => `
                            <input type="radio" class="btn-check" name="storage" id="storage-${i}" value="${st}" autocomplete="off" ${
                                i === 0 ? "checked" : ""
                              }>
                            <label class="btn btn-outline-secondary" for="storage-${i}">${
                                st || "Default"
                              }</label>
                          `
                            )
                            .join("")}
                        </span>
                      </p>`
                    : ""
                }

                <p>Color: 
                  <select id="colorSelect" name="color" class="rounded form-select w-auto">
                    ${colors
                      .map((c) => `<option value="${c}">${c}</option>`)
                      .join("")}
                  </select>
                </p>
              </div>

              <hr/>
              <div class="otherDetails">
                <p><strong>Description:</strong> ${product.des}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Category:</strong> ${product.category}</p>
              </div>
            </div>
          </div>
        `;
        const mainImg = document.getElementById("mainImage");
        const colorSelect = document.getElementById("colorSelect");
        const subImgContainer = document.getElementById("subImages");

        subImgContainer.innerHTML = "";
        allImages.forEach((imgUrl, i) => {
          const img = document.createElement("img");
          img.src = imgUrl;
          img.alt = "Sub image " + (i + 1);
          img.className = "img-thumbnail hover-zoom";
          img.style =
            "width: 70px; height: 70px; object-fit: cover; cursor: pointer;";
          img.addEventListener("click", () => {
            mainImg.src = imgUrl;
          });
          subImgContainer.appendChild(img);
        });

        colorSelect.addEventListener("change", () => {
          const selectedColor = colorSelect.value.toLowerCase();
          let catalogImage = null;
          if (Array.isArray(product.catalog)) {
            const catalogMap = {};
            product.catalog.forEach((entry) => {
              Object.entries(entry).forEach(([colorKey, value]) => {
                catalogMap[colorKey.toLowerCase()] = Array.isArray(value)
                  ? value[0]
                  : value;
              });
            });
            catalogImage = catalogMap[selectedColor];
          }
          mainImg.src = catalogImage || product.image[0];
        });

        const qtyEl = document.getElementById("quantity");
        const incBtn = document.getElementById("increaseBtn");
        const decBtn = document.getElementById("decreaseBtn");

        function updateQty() {
          qtyEl.innerText = quantity;
        }

        incBtn.addEventListener("click", () => {
          quantity++;
          updateQty();
        });

        decBtn.addEventListener("click", () => {
          if (quantity > 1) {
            quantity--;
            updateQty();
          }
        });

        document
          .getElementById("addToCartBtn")
          .addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            const id = product._id;
            const title = product.title;
            const image = product.image;
            const size =
              document.querySelector("input[name='size']:checked")?.value || "";
            const storage =
              document.querySelector("input[name='storage']:checked")?.value ||
              "";
            const color =
              document.querySelector("select[name='color']")?.value || "";

            const existing = cart.find(
              (item) =>
                item.id === id &&
                item.size === size &&
                item.storage === storage &&
                item.color === color
            );

            if (existing) {
              existing.qty += quantity;
            } else {
              cart.push({
                id,
                title,
                price,
                oldPrice,
                image,
                qty: quantity,
                size,
                storage,
                color,
              });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("Product added to cart!");
          });
      })
      .catch(() => {
        document.getElementById("product-container").innerText =
          "Failed to load product.";
      });
  }

  ProductDetails();
}
