document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("total-price");
  const disPrice = document.getElementById("discount");
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
      cartCounter.innerHTML = "<p>Total Price 0.</p>";
      return;
    }

    let totalDiscount = 0;
    let totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cart.forEach((item, index) => {
      const price = item.price * item.qty;
      const oldPrice = item.oldPrice ? item.oldPrice * item.qty : 0;

      const showPrice = oldPrice
        ? `<del>₹${oldPrice}</del> ₹${price}`
        : `₹${price}`;

      const discount = oldPrice ? oldPrice - price : 0;
      totalDiscount += discount;

      const showOldPrice = oldPrice ? oldPrice : price;

      const div = document.createElement("div");
      div.className = "cart-Prod";
      div.innerHTML = `
        <div class="cart-item">
          <div>
            <img src="${item.image}" width="100" alt="${item.title}" />
          </div>
          <div>
            <div class="cart-left">
              <div class="title-item">
                <h4>${item.title}</h4>
                <p>${showPrice}</p>
              </div>
              <div class="inc-dec">
                <button class="dec-btn" data-index="${index}">➖</button>
                <span>${item.qty}</span>
                <button class="inc-btn" data-index="${index}">➕</button>
              </div>
            </div>
            <button class="remove-btn" data-index="${index}">🗑 Remove</button>
          </div>
        </div>`;
      cartContainer.appendChild(div);

      let titleShort =
        item.title.length > 22 ? item.title.slice(0, 22) + "..." : item.title;

      cartCounter.innerHTML += `
        <div class="get-order">
          <div class="row cart-right">
            <p class="col-sm-1">${index + 1}</p>
            <p class="col-sm-4">${titleShort}</p>
            <span class="col-sm-2">x ${item.qty}</span>
            <p class="col-sm-4">₹${showOldPrice}</p>
          </div>
        </div>`;
    });

    totalPrice.innerHTML = `<span>₹${totalVal}</span>`;
    disPrice.innerHTML = `<span>-₹${totalDiscount}</span>`;

    attachButtonListeners();
  }

  function attachButtonListeners() {
    // Increment
    document.querySelectorAll(".inc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart[i].qty++;
        saveAndRender();
      });
    });

    // Decrement
    document.querySelectorAll(".dec-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (cart[i].qty > 1) {
          cart[i].qty--;
        } else {
          if (confirm("Quantity is 1. Remove item?")) {
            cart.splice(i, 1);
          } else {
            return; // cancel decrement
          }
        }
        saveAndRender();
      });
    });

    // Remove
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (confirm("Are you sure you want to remove this item?")) {
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

  updateCartDisplay();

  // Checkout button handler
  const checkoutBtn = document.getElementById("checkoutBtn");
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
});
