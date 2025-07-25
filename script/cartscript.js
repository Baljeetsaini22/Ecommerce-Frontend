function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("total-price");
  const disPrice = document.getElementById("discount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    cartContainer.innerHTML = "";
    cartCounter.innerHTML = "";
    totalPrice.innerHTML = "";
    disPrice.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center mt-5">
          <p>Your cart is empty.</p>
          <div><a href="../pages/productsView.html" class="btn btn-primary btn-lg mt-4">Shop Now</a></div>
        </div>`;
      cartCounter.innerHTML = "<p>Total Price: ₹0</p>";
      return;
    }

    let totalDiscount = 0;
    let totalVal = 0;

    cart.forEach((item, index) => {
      const price = item.price * item.qty;
      const oldPrice = item.oldPrice ? item.oldPrice * item.qty : 0;
      const discount = oldPrice ? oldPrice - price : 0;
      totalDiscount += discount;
      totalVal += price;
      const shortTitle = item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div><img src="${item.image}" alt="${item.title}" /></div>
        <div class="w-100 d-flex align-items-center justify-content-between">
          <div class="d-flex justify-content-between align-items-center">
            <a href='../pages/product.html?id=${item.id}' class="text-black">
              <div class="title-item">
                <h4>${shortTitle}</h4>
                <p>
                  ${oldPrice
                    ? `<del class="text-danger">₹${oldPrice}</del> <span class="text-success fw-bold">₹${price}</span>`
                    : `<span class="text-success fw-bold">₹${price}</span>`
                  }
                </p>
                <div class="d-flex gap-3 align-items-center">
                  ${item.color ? `<p class="mb-1">Color: ${item.color}</p>` : ""}
                  ${item.size
                    ? `<p class="mb-1">Size: ${item.size}</p>`
                    : item.storage
                    ? `<p class="mb-1">Storage: ${item.storage}</p>` : ""}
                </div>
              </div>
            </a>
          </div>
          <div class="mt-2 d-flex flex-column gap-3">
            <div class="inc-dec">
              <button class="dec-btn" data-index="${index}">➖</button>
              <span>${item.qty}</span>
              <button class="inc-btn" data-index="${index}">➕</button>
            </div>
            <button class="remove-btn" data-index="${index}">🗑 Remove</button>
          </div>
        </div>`;
      cartContainer.appendChild(div);

      const priceDisplay = oldPrice || price;
      cartCounter.innerHTML += `
        <div class="cart-right mb-1">
          <span>${index + 1}.</span>
          <span>${shortTitle}</span>
          <span>x ${item.qty}</span>
          <span>₹${priceDisplay}</span>
        </div>`;
    });

    totalPrice.innerHTML = `<span>₹${totalVal}</span>`;
    disPrice.innerHTML = `<span>-₹${totalDiscount}</span>`;
    attachButtonListeners();
  }

  function attachButtonListeners() {
    document.querySelectorAll(".inc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart[i].qty++;
        saveAndRender();
      });
    });

    document.querySelectorAll(".dec-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (cart[i].qty > 1) {
          cart[i].qty--;
        } else if (confirm("Quantity is 1. Remove item?")) {
          cart.splice(i, 1);
        }
        saveAndRender();
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (confirm("Remove this item from cart?")) {
          cart.splice(i, 1);
          saveAndRender();
        }
      });
    });
  }

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("auth"));
      if (user) {
        window.location.href = "../pages/checkout.html";
      } else {
        alert("Please login first to proceed to checkout.");
        window.location.href = "../pages/auth.html";
      }
    });
  }

  updateCartDisplay();
  updateCartCount();
});
