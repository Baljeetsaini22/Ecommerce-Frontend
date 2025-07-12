document.addEventListener("DOMContentLoaded", () => {
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("MRP");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  // console.log(cart);

  function updateCartDisplay() {
    cart.map((item, index) => {
      // console.log(item)
      const price = item.price * item.qty;
      const totalVal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      // console.log(item.id);

      let title = item.title.slice(0, 22);

      cartCounter.innerHTML += `
      <div class="get-order">
        <div class="row cart-right">
        
          <p class="col-sm-1"> ${index + 1}</p>
          <p class="col-sm-4"> ${title}</p>
          <span class="col-sm-2">x ${item.qty}</span>
          <p class="col-sm-4">Total: ₹${price}</p>
        </div>            
      </div>
      `;
      totalPrice.innerHTML = `<p>₹${totalVal}</p>`;
    });
  }
  updateCartDisplay();
});
