import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config & init
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

// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const form = document.getElementById("checkoutForm");
const orderDetails = document.getElementById("orderDetails");
const orderSummary = document.getElementById("cart-counter");
const totalPrice = document.getElementById("MRP");
const discount = document.getElementById("discount");

function renderCartItems() {
  if (cart.length === 0) {
    orderDetails.innerHTML = `<p class="text-muted">Your cart is empty.</p>`;
    orderSummary.innerHTML = `<p class="text-muted">No items in cart</p>`;
    form.style.display = "none";
    totalPrice.innerHTML = `<p>₹0</p>`;
    return;
  }

  orderDetails.innerHTML = "";
  cart.forEach((item) => {
    orderDetails.innerHTML += `
    <a href="../pages/product.html?id=${item.id}" class="text-black">
      <div class="d-flex justify-content-start align-items-center gap-4 mb-3 border-bottom pb-2 cart-item hover-scale rounded">
        <div class="item-imgs flex-shrink-0">
          <img src="${item.image}" alt="${item.title}" class="img-fluid rounded" />
        </div>
        <div>
          <p class="mb-1 fw-semibold">${item.title}</p>
          <span class="text-primary fw-bold">₹${item.price} × ${item.qty}</span>
        </div>
      </div>
      </a>
    `;
  });

  updateSummary();
}

function updateSummary() {
  const totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalOld = cart.reduce((sum, item) => sum + item.oldPrice * item.qty, 0);
  const save = totalOld - totalVal;
  
  orderSummary.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <p class="mb-1">Products (${cart.length} items)</p>
      <span class="fw-semibold">₹${totalVal}</span>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <p class="mb-1">Shipping Charge</p>
      <span class="fw-semibold">+ ₹50</span>
    </div>
  `;
  totalPrice.innerHTML = `<p class="fs-4 fw-bold">₹${totalVal + 50}</p>`;
  discount.innerHTML = `<span>You will save ₹${save} on this order</span>`
}

function togglePaymentSections() {
  const sections = ["upiSection", "cardSection", "netBankingSection"];
  sections.forEach((id) => document.getElementById(id).classList.add("d-none"));

  const selectedMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  )?.value;
  if (selectedMethod === "UPI") {
    document.getElementById("upiSection").classList.remove("d-none");
  } else if (selectedMethod === "Card") {
    document.getElementById("cardSection").classList.remove("d-none");
  } else if (selectedMethod === "NetBanking") {
    document.getElementById("netBankingSection").classList.remove("d-none");
  }
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

  // Validate payment details based on method
  if (paymentMethod === "UPI") {
    const upiID = document.getElementById("upiID").value.trim();
    if (!upiID) return alert("Please enter a valid UPI ID.");
    if (!confirm(`Pay ₹${totalPayable} from ${upiID}?`)) return;
  } else if (paymentMethod === "Card") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value.trim();
    const cardCVV = document.getElementById("cardCVV").value.trim();
    if (!cardNumber || !cardExpiry || !cardCVV)
      return alert("Fill in all card details.");
    if (
      !confirm(
        `Pay ₹${totalPayable} using card ending with ${cardNumber.slice(-4)}?`
      )
    )
      return;
  } else if (paymentMethod === "NetBanking") {
    const bankName = document.getElementById("bankName").value.trim();
    const bankState = document.getElementById("bankState").value.trim();
    const bankCity = document.getElementById("bankCity").value.trim();
    if (!bankName || !bankState || !bankCity)
      return alert("Fill in all net banking details.");
    if (!confirm(`Pay ₹${totalPayable} via ${bankName} NetBanking?`)) return;
  }

  const userDetails = {
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    pincode: form.pincode.value.trim(),
    address: form.address.value.trim(),
    city: form.city.value.trim(),
    state: form.state.value.trim(),
    country: form.country.value.trim(),
    additionalInfo: form.additionalInfo.value.trim(),
    paymentMethod,
    cart,
    totalPayable,
    createdAt: serverTimestamp(),
  };

  // Add optional payment info
  if (paymentMethod === "UPI") userDetails.upiID = form.upiID.value.trim();
  else if (paymentMethod === "Card") {
    userDetails.cardNumber = form.cardNumber.value.trim();
    userDetails.cardExpiry = form.cardExpiry.value.trim();
    userDetails.cardCVV = form.cardCVV.value.trim();
  } else if (paymentMethod === "NetBanking") {
    userDetails.bankName = form.bankName.value.trim();
    userDetails.bankState = form.bankState.value.trim();
    userDetails.bankCity = form.bankCity.value.trim();
  }

  try {
    await addDoc(collection(db, "orders"), userDetails);
    alert("Order placed successfully! Thank you for shopping with us.");
    form.reset();
    localStorage.removeItem("cart");
    togglePaymentSections();
    location.reload();
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    alert("Failed to place order.");
  }
});

document.querySelectorAll('input[name="paymentMethod"]').forEach((input) => {
  input.addEventListener("change", togglePaymentSections);
});

// Initial rendering
document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  togglePaymentSections();
});
