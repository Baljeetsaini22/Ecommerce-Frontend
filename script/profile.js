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

const userInfoDiv = document.getElementById("userInfo");
const orderHistoryDiv = document.getElementById("orderHistory");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // Get user data
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      userInfoDiv.innerHTML = `
              <h5 class="mb-3">Welcome, ${userData.name} 👋</h5>
              <p><strong>Email:</strong> ${userData.email}</p>
              <p><strong>Mobile:</strong> ${userData.mobile}</p>
              <p><strong>UID:</strong> ${userData.uid}</p>
            `;
    } else {
      userInfoDiv.innerHTML = `<p>User data not found.</p>`;
    }

    // Firestore Order History
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      orderHistoryDiv.innerHTML += `<p>No orders found in Firestore.</p>`;
    } else {
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        const cartItems = order.cart
          .map(
            (item) => `
                <div class="d-flex align-items-center mb-2">
                  <img src="${item.image}" class="item-img" alt="${item.title}" />
                  <div>
                    <p class="mb-0">${item.title}</p>
                    <small>Price: ₹${item.price} × ${item.qty}</small>
                  </div>
                </div>
              `
          )
          .join("");

        orderHistoryDiv.innerHTML += `
                <div class="order-card">
                  <p><strong>Full Name:</strong> ${order.fullName}</p>
                  <p><strong>Email:</strong> ${order.email}</p>
                  <p><strong>Mobile:</strong> ${order.mobile}</p>
                  <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state} - ${order.pincode}, ${order.country}</p>
                  <p><strong>Additional Info:</strong> ${order.additionalInfo}</p>
                  <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                  <p><strong>Total Payable:</strong> ₹${order.totalPayable}</p>
                  <div><strong>Cart Items:</strong><br/>${cartItems}</div>
                </div>
              `;
      });
    }

    // LocalStorage Order Display
    const localCart = JSON.parse(localStorage.getItem("purchased")) || [];
    if (localCart.length > 0) {
      const localOrderHTML = localCart
        .map(
          (item) => `
              <div class="d-flex align-items-center mb-2">
                <img src="${item.image}" class="item-img" alt="${item.title}" />
                <div>
                  <p class="mb-0">${item.title}</p>
                  <small>Price: ₹${item.price} × ${item.qty}</small>
                </div>
              </div>
            `
        )
        .join("");

      orderHistoryDiv.innerHTML += `
              <div class="order-card border-warning">
                <p><strong>Recent Local Order (Not Synced):</strong></p>
                ${localOrderHTML}
              </div>
            `;
    }
  } else {
    userInfoDiv.innerHTML = `<p>Please log in to see profile and orders.</p>`;
  }
});
