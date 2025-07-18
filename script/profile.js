import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const authData = JSON.parse(localStorage.getItem("auth"));

async function renderUserProfile(userData) {
  const fullName = userData.fullName || userData.name || "N/A";
  const { email, uid, mobile } = userData;
  document.getElementById("userFullName").textContent = fullName;
  document.getElementById("userEmail").textContent = email || "N/A";
  document.getElementById("userUID").textContent = uid || "N/A";
  document.getElementById("userMobile").textContent = mobile || "N/A";
}

async function fetchOrders() {
  const orderListContainer = document.getElementById("orderList");
  if (!authData?.uid) return;

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("uid", "==", authData.uid));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      orderListContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    querySnapshot.forEach((doc, i) => {
      const order = doc.data();
      const orderCard = document.createElement("div");
      orderCard.className = "card mb-3 p-3";

      let productsHTML = "";
      (order.cart || []).forEach((item) => {
        productsHTML += `
              <li>
                <a href="/product.html?id=${item.id}" class="text-decoration-none text-primary">
                  ${item.title}
                </a> - Qty: ${item.qty} - ₹${item.price}
              </li>`;
      });

      orderCard.innerHTML = `
            <h5>Order #${i + 1}</h5>
            <ul>${productsHTML}</ul>
            <p><strong>Total Payable:</strong> ₹${order.totalPayable}</p>
            <p><strong>Delivery Address:</strong> ${order.address}</p>
          `;

      orderListContainer.appendChild(orderCard);
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    orderListContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

async function loadUserProfile() {
  if (!authData?.uid) return;
  const docRef = doc(db, "users", authData.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    renderUserProfile(docSnap.data());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  fetchOrders();
});
