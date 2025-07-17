document.addEventListener("DOMContentLoaded", () => {
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("MRP");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];


  function updateCartDisplay() {
    cart.map((item, index) => {

      const totalVal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      cartCounter.innerHTML = `
      <div class="d-flex justify-content-between">
      <p>Porduct (${index + 1} items)</p><span>₹${totalVal}</span></div>
      `;
      totalPrice.innerHTML = `<p>₹${totalVal}</p>`;
    });
  }
  updateCartDisplay();
});
