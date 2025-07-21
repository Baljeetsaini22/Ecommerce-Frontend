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
          <div><a href="../pages/productsView.html" class="shop-btn">Shop Now</a></div>
        </div>`;
      cartCounter.innerHTML = "<p>Total Price: ₹0</p>";
      return;
    }

    let totalDiscount = 0;
    let totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cart.forEach((item, index) => {
      const price = item.price * item.qty;
      const oldPrice = item.oldPrice ? item.oldPrice * item.qty : 0;
      const discount = oldPrice ? oldPrice - price : 0;
      totalDiscount += discount;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div><img src="${item.image}" alt="${item.title}" /></div>
        <div class="w-100">
          <div class="d-flex justify-content-between align-items-center">
            <div class="title-item">
              <h4>${item.title}</h4>
              <p>
                ${oldPrice ? `<del class="text-danger">₹${oldPrice}</del> <span class="text-success fw-bold">₹${price}</span>` : `<span class="text-success fw-bold">₹${price}</span>`}
              </p>
            </div>
            <div class="inc-dec">
              <button class="dec-btn" data-index="${index}">➖</button>
              <span>${item.qty}</span>
              <button class="inc-btn" data-index="${index}">➕</button>
            </div>
          </div>
          <div class="text-end mt-2">
            <button class="remove-btn" data-index="${index}">🗑 Remove</button>
          </div>
        </div>
      `;
      cartContainer.appendChild(div);

      const shortTitle = item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;
      const priceDisplay = oldPrice ? oldPrice : price;
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
});
