import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

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
  const orderSummary = document.getElementById("orderSummary");

  if (cart.length === 0) {
    orderDetails.innerHTML = "<p>Your cart is empty.</p>";
    orderSummary.innerHTML = "<p>No items in cart</p>";
    form.style.display = "none";
  } else {
    let total = 0;
    cart.forEach((item) => {
      orderDetails.innerHTML += `
      <div class="d-flex justify-content-start align-items-center gap-5">
        <div class="item-imgs"><img src="${item.image}" alt="${item.title}"/></div>
        <div>
          <p>${item.title} </p>
          <span>Rs.${item.price}</span>
        </div> 
        </div>
      `;
    });
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

    const totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalPayable = totalVal + 50;

    // Payment simulation
    if (paymentMethod === "UPI") {
      const upiID = document.getElementById("upiID").value.trim();
      if (!upiID) {
        alert("Please enter a valid UPI ID to proceed.");
        return;
      }
      const confirmUPI = confirm(`Pay ₹${totalPayable} from ${upiID}?`);
      if (!confirmUPI) return;
    }

    if (paymentMethod === "Card") {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardExpiry = document.getElementById("cardExpiry").value.trim();
      const cardCVV = document.getElementById("cardCVV").value.trim();

      if (!cardNumber || !cardExpiry || !cardCVV) {
        alert("Please fill in all card details to proceed.");
        return;
      }
      const confirmCard = confirm(
        `Pay ₹${totalPayable} using card ending with ${cardNumber.slice(-4)}?`
      );
      if (!confirmCard) return;
    }

    if (paymentMethod === "NetBanking") {
      const bankName = document.getElementById("bankName").value.trim();
      const bankState = document.getElementById("bankState").value.trim();
      const bankCity = document.getElementById("bankCity").value.trim();

      if (!bankName || !bankState || !bankCity) {
        alert("Please fill in all net banking details to proceed.");
        return;
      }
      const confirmNet = confirm(
        `Pay ₹${totalPayable} via ${bankName} NetBanking?`
      );
      if (!confirmNet) return;
    }

    // Gather user details
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
      totalPayable: totalPayable,
    };

    // Include optional fields
    if (paymentMethod === "UPI")
      userDetails.upiID = document.getElementById("upiID").value;
    if (paymentMethod === "Card") {
      userDetails.cardNumber = document.getElementById("cardNumber").value;
      userDetails.cardExpiry = document.getElementById("cardExpiry").value;
      userDetails.cardCVV = document.getElementById("cardCVV").value;
    }
    if (paymentMethod === "NetBanking") {
      userDetails.bankName = document.getElementById("bankName").value;
      userDetails.bankState = document.getElementById("bankState").value;
      userDetails.bankCity = document.getElementById("bankCity").value;
    }

    try {
      await addDoc(collection(db, "orders"), userDetails);
      alert("Order placed successfully! Thank you for shopping with us.");
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
document.addEventListener("DOMContentLoaded", updateUser);

document.addEventListener("DOMContentLoaded", () => {
  const cartCounter = document.getElementById("cart-counter");
  const totalPrice = document.getElementById("MRP");
  function updateCartDisplay() {
    cart.map((item, index) => {
      const totalVal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      cartCounter.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
      <p>Porduct (${index + 1} items)</p><span>₹${totalVal}</span></div>
      <div class="d-flex justify-content-between align-items-center"><p>Shipment Charge</p><span>+ ₹50</span></div>
      `;
      totalPrice.innerHTML = `<p>₹${totalVal + 50}</p>`;
    });
  }
  updateCartDisplay();
});
