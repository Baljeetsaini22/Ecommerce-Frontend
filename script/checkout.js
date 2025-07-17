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
// const firebaseConfig = {
//   apiKey: "AIzaSyDP2TktQJUtRfloWBoKTwlnzEJeRlUSS6M",
//   authDomain: "ecommerce-project-eda80.firebaseapp.com",
//   projectId: "ecommerce-project-eda80",
//   storageBucket: "ecommerce-project-eda80.appspot.com",
//   messagingSenderId: "555193689458",
//   appId: "1:555193689458:web:8b3be9e69bb7ac0d1869eb",
//   measurementId: "G-6XB0QJEKK3",
// };
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
function updateUser() {
  const firebaseConfig = {
    apiKey: "AIzaSyDP2TktQJUtRfloWBoKTwlnzEJeRlUSS6M",
    authDomain: "ecommerce-project-eda80.firebaseapp.com",
    projectId: "ecommerce-project-eda80",
    storageBucket: "ecommerce-project-eda80.appspot.com",
    messagingSenderId: "555193689458",
    appId: "1:555193689458:web:8b3be9e69bb7ac0d1869eb",
    measurementId: "G-6XB0QJEKK3",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const form = document.getElementById("checkoutForm");
  const orderDetails = document.getElementById("orderDetails");
  const orderSummaryDiv = document.getElementById("orderSummary");

  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    orderDetails.innerHTML = "<p>Your cart is empty.</p>";
    orderSummaryDiv.innerHTML = "<p>No items in cart</p>";
    form.style.display = "none";
  } else {
    let orderHTML = "";
    let total = 0;
    cart.forEach((item) => {
      orderHTML += `
      <div class="d-flex justify-content-start align-items-center gap-5">
        <div class="item-imgs"><img src="${item.image}" alt="${item.title}"/></div>
        <div>
          <p>${item.title} </p>
          <span>Rs.${item.price}</span>
        </div> 
        </div>
      `;
      
      total += parseFloat(item.price);
    });
    orderHTML += `<p><strong>Total: Rs.${total}</strong></p>`;
    orderDetails.innerHTML = orderHTML;
    orderSummaryDiv.innerHTML = `<p>Subtotal: Rs.${total}</p><p>Shipping: Rs.50</p><hr /><p><strong>Total: Rs.${
      total + 50
    }</strong></p>`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;

    const userDetails = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      mobile: document.getElementById("mobile").value,
      pincode: document.getElementById("pincode").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
      additionalInfo: document.getElementById("additionalInfo").value,
      paymentMethod: paymentMethod,
      cart: cart,
    };

    if (paymentMethod === "UPI") {
      userDetails.upiID = document.getElementById("upiID").value;
    } else if (paymentMethod === "Card") {
      userDetails.cardNumber = document.getElementById("cardNumber").value;
      userDetails.cardExpiry = document.getElementById("cardExpiry").value;
      userDetails.cardCVV = document.getElementById("cardCVV").value;
    } else if (paymentMethod === "NetBanking") {
      userDetails.bankName = document.getElementById("bankName").value;
      userDetails.bankState = document.getElementById("bankState").value;
      userDetails.bankCity = document.getElementById("bankCity").value;
    }

    try {
      await addDoc(collection(db, "orders"), userDetails);
      alert(
        "Order placed successfully! Thank you for shopping with us. Visit again!"
      );
      form.reset();
      localStorage.removeItem("cart");
      document.getElementById("upiSection").classList.add("d-none");
      document.getElementById("cardSection").classList.add("d-none");
      document.getElementById("netBankingSection").classList.add("d-none");
      window.location.reload();
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("Failed to place order.");
    }
  });

  document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
    input.addEventListener("change", () => {
      document.getElementById("upiSection").classList.add("d-none");
      document.getElementById("cardSection").classList.add("d-none");
      document.getElementById("netBankingSection").classList.add("d-none");

      if (input.checked) {
        if (input.value === "UPI")
          document.getElementById("upiSection").classList.remove("d-none");
        if (input.value === "Card")
          document.getElementById("cardSection").classList.remove("d-none");
        if (input.value === "NetBanking")
          document
            .getElementById("netBankingSection")
            .classList.remove("d-none");
      }
    });
  });
}
updateUser();
