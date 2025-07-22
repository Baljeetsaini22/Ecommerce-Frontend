// ✅ Updated and Merged Firebase Profile + Edit + Cancel Order Code

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
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

const usernameEl = document.getElementById("username");
const useremailEl = document.getElementById("useremail");
const usermobileEl = document.getElementById("usermobile");
const useridEl = document.getElementById("userid");
const userCreatedEl = document.getElementById("userCreated");
const orderList = document.getElementById("orderList");
const deactivateBtn = document.getElementById("deactivateBtn");
const deleteBtn = document.getElementById("deleteBtn");

const editForm = document.getElementById("editProfileForm");
const editName = document.getElementById("editName");
const editMobile = document.getElementById("editMobile");
const editEmail = document.getElementById("editEmail");
const editAddress = document.getElementById("editAddress");

function formatTimestamp(timestamp) {
  if (!timestamp) return "-";
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }
  return "-";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in to view your profile.");
    window.location.href = "../pages/auth.html";
    return;
  }

  try {
    useridEl.textContent = user.uid;

    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.data();

    if (userSnap.exists()) {
      usernameEl.textContent = userData.name || "User";
      useremailEl.textContent = userData.email || "-";
      usermobileEl.textContent = userData.mobile || "-";
      userCreatedEl.textContent = formatTimestamp(userData.createdAt);

      editName.value = userData.name || "";
      editMobile.value = userData.mobile || "";
      editEmail.value = user.email || "";
      editAddress.value = userData.address || "";
    }

    const ordersSnapshot = await getDocs(collection(db, "orders"));
    orderList.innerHTML = "";

    if (ordersSnapshot.empty) {
      orderList.innerHTML = `<li class="text-muted">No orders found.</li>`;
      return;
    }

    ordersSnapshot.forEach((docSnap) => {
      const order = docSnap.data();
           const orderDate = formatTimestamp(order.createdAt);

      const itemsHtml = (order.cart || [])
        .map(
          (item) => `
          <div class="order-item d-flex align-items-center mb-2" style="cursor: pointer; width: 85%;" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="order-item-img" />
            <div>
              <strong>${item.title}</strong><br />
              ₹${item.price} × ${item.qty}
            </div>
          </div>
        `
        )
        .join("");

      const li = document.createElement("li");
      li.className = "card card-order p-3";
      li.innerHTML = `
        <h5 class="mb-1">${order.fullName}</h5>
        <small class="text-muted">Order Date: ${orderDate}</small>
        <p class="mb-1">
          <strong>Mobile:</strong> ${order.mobile}<br />
          <strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.country} - ${order.pincode}
        </p>
        <p class="mb-1">
          <strong>Payment:</strong> ${order.paymentMethod} | <strong>Total:</strong> ₹${order.totalPayable}
        </p>
        <p class="mb-2"><em>Note:</em> ${order.additionalInfo || "-"}</p>
        <div class="order-items">${itemsHtml}</div>
        <button class="btn btn-sm btn-danger cancel-order-btn mt-2" data-id="${docSnap.id}">Cancel Order</button>
      `;

      li.querySelectorAll(".order-item").forEach((el) => {
        el.addEventListener("click", (e) => {
          const productId = el.dataset.id;
          if (productId) {
            window.location.href = `../pages/product.html?id=${productId}`;
          }
        });
      });

      orderList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading profile or orders:", error);
    orderList.innerHTML = `<li class="text-danger">Error: ${error.message}</li>`;
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    name: editName.value,
    mobile: editMobile.value,
    address: editAddress.value,
  };

  try {
    const user = auth.currentUser;
    if (!user) return alert("No user");

    await updateDoc(doc(db, "users", user.uid), updatedData);
    alert("Profile updated.");
    location.reload();
  } catch (err) {
    alert("Error updating profile: " + err.message);
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("cancel-order-btn")) {
    const id = e.target.dataset.id;
    if (confirm("Cancel this order?")) {
      await deleteDoc(doc(db, "orders", id));
      alert("Order cancelled.");
      location.reload();
    }
  }
});

deactivateBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged out.");
    window.location.href = "../pages/auth.html";
  } catch (error) {
    alert("Logout error: " + error.message);
  }
});

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Permanently delete your account?")) return;
  const user = auth.currentUser;
  if (!user) return alert("No user logged in.");

  try {
    await deleteUser(user);
    alert("Account deleted.");
    window.location.href = "../pages/auth.html";
  } catch (error) {
    alert("Re-login and try again. " + error.message);
  }
});

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import {
//   getFirestore,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// import {
//   getAuth,
//   onAuthStateChanged,
//   deleteUser,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyDP2TktQJUtRfloWBoKTwlnzEJeRlUSS6M",
//   authDomain: "ecommerce-project-eda80.firebaseapp.com",
//   projectId: "ecommerce-project-eda80",
//   storageBucket: "ecommerce-project-eda80.appspot.com",
//   messagingSenderId: "555193689458",
//   appId: "1:555193689458:web:8b3be9e69bb7ac0d1869eb",
//   measurementId: "G-6XB0QJEKK3",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // DOM elements
// const usernameEl = document.getElementById("username");
// const useremailEl = document.getElementById("useremail");
// const usermobileEl = document.getElementById("usermobile");
// const useridEl = document.getElementById("userid");
// const userCreatedEl = document.getElementById("userCreated");
// const orderList = document.getElementById("orderList");
// const deactivateBtn = document.getElementById("deactivateBtn");
// const deleteBtn = document.getElementById("deleteBtn");

// // Utility: format Firestore timestamp to local string
// function formatTimestamp(timestamp) {
//   if (!timestamp) return "-";
//   if (typeof timestamp.toDate === "function") {
//     return timestamp.toDate().toLocaleString();
//   }
//   if (timestamp.seconds) {
//     return new Date(timestamp.seconds * 1000).toLocaleString();
//   }
//   return "-";
// }

// // Load user profile and orders
// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     alert("Please log in to view your profile.");
//     window.location.href = "../pages/auth.html";
//     return;
//   }

//   try {
//     // Show User ID
//     useridEl.textContent = user.uid;

//     // Load user data
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     if (userDoc.exists()) {
//       const data = userDoc.data();
//       usernameEl.textContent = data.name || "User";
//       useremailEl.textContent = data.email || "-";
//       usermobileEl.textContent = data.mobile || "-";
//       userCreatedEl.textContent = formatTimestamp(data.createdAt);
//     } else {
//       usernameEl.textContent = "User";
//       useremailEl.textContent = "-";
//       usermobileEl.textContent = "-";
//       userCreatedEl.textContent = "-";
//     }

//     // Load user orders
//     const ordersSnapshot = await getDocs(collection(db, "orders"));
//     orderList.innerHTML = "";

//     if (ordersSnapshot.empty) {
//       orderList.innerHTML = `<li class="text-muted">No orders found.</li>`;
//       return;
//     }

//     ordersSnapshot.forEach((docSnap) => {
//       const order = docSnap.data();

//       const orderDate = formatTimestamp(order.createdAt);

//       // Generate order cart items HTML
//       const itemsHtml = (order.cart || [])
//         .map(
//           (item) => `
//             <div class="order-item d-flex align-items-center mb-2" style="cursor: pointer;" data-id="${item.id}">
//               <img src="${item.image}" alt="${item.title}" class="order-item-img" />
//               <div>
//                 <strong>${item.title}</strong><br />
//                 ₹${item.price} × ${item.qty}
//               </div>
//             </div>
//           `
//         )
//         .join("");

//       // Create order element
//       const li = document.createElement("li");
//       li.className = "card card-order p-3";
//       li.innerHTML = `
//         <h5 class="mb-1">${order.fullName}</h5>
//         <small class="text-muted">Order Date: ${orderDate}</small>
//         <p class="mb-1">
//           <strong>Mobile:</strong> ${order.mobile}<br />
//           <strong>Address:</strong> ${order.address}, ${order.city}, ${
//         order.state
//       }, ${order.country} - ${order.pincode}
//         </p>
//         <p class="mb-1">
//           <strong>Payment:</strong> ${
//             order.paymentMethod
//           } | <strong>Total:</strong> ₹${order.totalPayable}
//         </p>
//         <p class="mb-2"><em>Note:</em> ${order.additionalInfo || "-"}</p>
//         <div class="order-items">${itemsHtml}</div>
//       `;

//       // Clicking order redirects to first product in order (if available)
//       li.querySelectorAll(".order-item").forEach((el) => {
//         el.addEventListener("click", (e) => {
//           e.stopPropagation(); // optional, in case li has a click listener
//           const productId = el.dataset.id;
//           //  const productId = order.cart?.[0].id;
//           console.log(productId);
          
//           if (productId) {
//             window.location.href = `../pages/product.html?id=${productId}`;
//           } else {
//             alert("No product ID found.");
//           }
//         });
//       });

//       orderList.appendChild(li);
//     });
//   } catch (error) {
//     console.error("Error loading profile or orders:", error);
//     orderList.innerHTML = `<li class="text-danger">Error loading orders: ${error.message}</li>`;
//   }
// });

// // Logout (Deactivate) button
// deactivateBtn.addEventListener("click", async () => {
//   try {
//     await signOut(auth);
//     alert("Logged out.");
//     window.location.href = "../pages/auth.html";
//   } catch (error) {
//     alert("Error during logout: " + error.message);
//   }
// });

// // Delete account button
// deleteBtn.addEventListener("click", async () => {
//   if (!confirm("Are you sure you want to permanently delete your account?"))
//     return;

//   const user = auth.currentUser;
//   if (!user) {
//     alert("No user logged in.");
//     return;
//   }

//   try {
//     await deleteUser(user);
//     alert("Account deleted.");
//     window.location.href = "../pages/auth.html";
//   } catch (error) {
//     alert("You may need to re-login and try again. " + error.message);
//   }
// });
