document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("total-price");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartCounter.innerHTML = "<p>Total Price 0.</p>";
      return;
    }

    cart.map((item, index) => {
      // console.log(item)

      const price = item.price * item.qty;
      const totalVal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      console.log(item.id);

      const div = document.createElement("div");
      div.className = "cart-Prod";      
      div.innerHTML += `
      <div class="cart-item">
        <div>
          <img src="${item.image}" width="100" />
        </div>
        <div>
          <div class="cart-left">
            <div class="title-item">
              <h4>${item.title}</h4>
              <p>Price: ₹${item.price}</p>
            </div>
            <div class="inc-dec">
              <button class="dec-btn" data-index="${index}">➖</button>
              <span>${item.qty}</span>
              <button class="inc-btn" data-index="${index}" >➕</button>
            </div>
          </div>          
          <button class="remove-btn" data-index="${index}">🗑 Remove</button>
        </div>
      </div>
      `;
      cartContainer.appendChild(div);
      
      let title = item.title.slice(0, 22);

      cartCounter.innerHTML += `
      <div class="get-order">
        <div class="row cart-right">
        
          <p class="col-sm-1"> ${index+ 1}</p>
          <p class="col-sm-4"> ${title}</p>
          <span class="col-sm-2">x ${item.qty}</span>
          <p class="col-sm-4">Total: ₹${price}</p>
        </div>            
      </div>
      `;
      totalPrice.innerHTML = `<p>₹${totalVal}</p>`
    });

    attachButtonListeners();
  }

  function attachButtonListeners() {
    // Increment
    document.querySelectorAll(".inc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        cart[i].qty++;
        cartCounter.innerHTML =" "
        saveAndRender();
      });
    });

    // Decrement
    document.querySelectorAll(".dec-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        if (cart[i].qty > 1) {
          cart[i].qty--;
          cartCounter.innerHTML =" "
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
        cartCounter.innerHTML =" "
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
