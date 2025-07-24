const path = window.location.pathname;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  cartCountEl.innerHTML = cart.length > 0 ? cart.length : 0;
}
document.addEventListener("DOMContentLoaded", updateCartCount);

if (path.includes("product.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  let quantity = 1;

  function ProductDetails() {
    fetch("/product.json")
      .then((res) => res.json())
      .then((data) => {
        const product = data.find((item) => String(item._id) === productId);
        if (!product) {
          return (document.getElementById("product-container").innerText =
            "Product not found.");
        }

        const image = product.image;
        const subImage = product.subImage || [];
        const newPrice = Number(product.price.toString().replace(/,/g, ""));
        const priceOld = Number(product.oldPrice.toString().replace(/,/g, ""));
        const discount =
          priceOld && newPrice
            ? Math.floor(((priceOld - newPrice) / priceOld) * 100)
            : 0;

        const color = product.color || [];
        const size = product.size || [];
        const showSize = Array.isArray(size) && size.length > 0;

        document.getElementById("product-container").innerHTML = `
          <div class="about-product row g-4">
            <div class="col-md-6 product-img">
              <img id="mainImage" src="${image}" class="img-fluid border mb-3 main-img" alt="Main Image" style="max-height: 400px; object-fit: contain;" />
              <div id="subImages" class="d-flex flex-wrap gap-2"></div>
            </div>
            <div class="col-md-6 description">
              <h2>${product.title}</h2>
              <div class="price">              
                <span class="lessPrice text-danger">${"-" + discount + "%"}</span>
                <p>
                  ${
                    priceOld
                      ? `<del class="text-danger">₹${priceOld}</del> 
                        <span class="text-success fw-bold">₹${newPrice}</span>`
                      : `<span class="text-success fw-bold">₹${newPrice}</span>`
                  }
                </p>
                <p>Total: ₹<span id="totalPrice">${newPrice}</span></p>
              </div>
              <div class="quantity-control my-2">
                <button class="btnincDec btn btn-outline-secondary" id="decreaseBtn">-</button>
                <span id="quantity" class="mx-2">1</span>
                <button class="btnincDec btn btn-outline-secondary" id="increaseBtn">+</button>
              </div>
              <button id="addToCartBtn" class="cart-btn btn btn-primary my-2">
                <span>Add to Cart</span>
              </button>
              <hr/>
              <div class="prod-ablity">
              <p>Size: 
                      <select name="size" class="rounded">
                        ${size.map((s) => `<option value="${s}">${s}</option>`).join("")}
                      </select>
              </p>

              <p>Color: 
                      <select name="color" class="rounded">
                        ${color.map((c) => `<option value="${c}">${c}</option>`).join("")}
                      </select>
              </p>
              </div>
              <hr />
              <div class="otherDetails">
                <p><strong>Description:</strong> ${product.des}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Category:</strong> ${product.category}</p>
              </div>
            </div>
          </div>
        `;

        // Add subImages
        const mainImg = document.getElementById("mainImage");
        const subImgContainer = document.getElementById("subImages");
        const allImages = [image, ...subImage];

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


        const qtyEl = document.getElementById("quantity");
        const totalEl = document.getElementById("totalPrice");
        const incBtn = document.getElementById("increaseBtn");
        const decBtn = document.getElementById("decreaseBtn");

        function updateTotal() {
          qtyEl.innerText = quantity;
          totalEl.innerText = newPrice * quantity;
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

        // Add to cart
        document
          .getElementById("addToCartBtn")
          .addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];

            const id = product._id;
            const title = product.title;
            const price = newPrice;
            const oldPrice = priceOld;
            const image = product.image;

            const size =
              document.querySelector("select[name='size']")?.value || "";
            const color =
              document.querySelector("select[name='color']")?.value || "";

            const existing = cart.find(
              (item) =>
                item.id === id && item.size === size && item.color === color
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
                color,
              });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("Product added to cart!");
          });
      })
      .catch((err) => {
        console.error(err);
        document.getElementById("product-container").innerText =
          "Failed to load product.";
      });
  }

  ProductDetails();
}