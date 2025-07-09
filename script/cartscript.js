document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCounter = document.getElementById("cart-counter");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartCounter.innerHTML = "<p>Total Price 0.</p>";
      return;
    }

    cart.forEach((item, index) => {
      // console.log(item)

      const price = item.price * item.qty;
      const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      console.log(item.id)
      
      const div = document.createElement("div");
      div.className = "cart-Prod";
      div.innerHTML = `
      <div class="cart-item">
        <div>
        <img src="${item.image}" width="100" />
        </div>
        <div>
          <h3>${item.title}</h3>
          <p>Price: ₹${item.price}</p>
          <div>
            <button class="dec-btn" data-index="${index}">➖</button>
            <span>${item.qty}</span>
            <button class="inc-btn" data-index="${index}">➕</button>
          </div>
          <p>Total: ₹${price}</p>
          <button class="remove-btn" data-index="${index}">🗑 Remove</button>
        </div>
        </div>
      `;


      cartContainer.appendChild(div);
      cartCounter.innerHTML = `
      <div class="get-order">
        <div class="Order-price"><p>Total Price: ₹${totalPrice}</p></div>
        
      </div>`;
    });
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
             window.location.reload();
            cart.splice(i, 1);
          }
        }
        saveAndRender();
      });
    });

    // Remove
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        saveAndRender();
      });
    });
  }

  function saveAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  updateCartDisplay();
});


