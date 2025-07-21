const path = window.location.pathname;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
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
          ? Math.round(
              ((product.price - product.oldPrice) / product.oldPrice) * 100
            )
          : 0;
        const newPrice = Math.floor(product.price * 80);
        const priceOld =
          product.oldPrice &&
          !isNaN(product.oldPrice) &&
          Number(product.oldPrice) * 80 > newPrice
            ? Math.floor(Number(product.oldPrice) * 80)
            : null;

       
        document.getElementById("product-container").innerHTML = `
          <div class="about-product"> 
            <div class="product-img">
              <img src="${product.image}" alt="${product.title}" width="150" />
            </div>
            <div class="description">
              <h2>${product.title}</h2>
              
              <div class="price">              
                <span class="lessPrice">${discountPercent}% off</span>
                 <p>
                ${
                  priceOld
                    ? `<del class="text-danger">₹${priceOld}</del> <span class="text-success">₹${newPrice}</span>`
                    : `<span class="text-success fw-bold">₹${newPrice}</span>`
                }
              </p>
              </div>
              <div class="quantity-control">
                <button class="btnincDec" id="decreaseBtn">-</button>
                <span id="quantity">1</span>
                <button class="btnincDec" id="increaseBtn">+</button>
              </div>
             
              <button id="addToCartBtn" class="cart-btn">
                <span>Add to Cart</span>
              </button>
              <hr/>
              <div class="prod-ablity">
              <p>Size: <select>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
              </select>
              </p>
              <p>Color: <select>
              <option>Black</option>
              <option>Red</option>
              <option>Blue</option>
              </select>
              </p>
              </div>
              <hr />
              <div class="otherDetails">
                <p><strong>Discription:</strong> ${product.des}</p>
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
          const price = newPrice;
          const image = product.image;
          const oldPriceRaw = priceOld;
          const oldPrice =
            oldPriceRaw && !isNaN(oldPriceRaw) ? parseFloat(oldPriceRaw) : null;

          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find((item) => item.id === id);

          if (existing) {
            existing.qty += quantity;
          } else {
            cart.push({ id, title, oldPrice, price, image, qty: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Product added to cart!");
          window.location.reload();
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
