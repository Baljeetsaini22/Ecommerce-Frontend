// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
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
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Replace this with dynamic user email if using Firebase Auth
const userEmail = "test@example.com";

// Load profile data
async function loadProfile() {
  const userRef = doc(db, "users", userEmail); // Or use UID if that's your doc ID
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById("fullName").value = data.name || "";
    document.getElementById("email").value = data.email || userEmail;
  } else {
    console.warn("User profile not found.");
  }
}

// Submit profile form
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    uid: userEmail, // if you're using email as ID
  };

  try {
    await setDoc(doc(db, "users", userEmail), updatedData);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile.");
  }
});

// // Load profile and orders on page load
// loadProfile();
// loadOrders();

// Load order history
async function loadOrders() {
  const q = query(
    collection(db, "orders"),
    where("additionalInfo.email", "==", userEmail)
  );
  const querySnapshot = await getDocs(q);
  const tbody = document.getElementById("ordersBody");
  tbody.innerHTML = "";

  let index = 1;
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const total =
      data.cart?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;

    tbody.innerHTML += `
      <tr>
        <td>${index++}</td>
        <td>${data.cart?.length || 0}</td>
        <td>₹${data.totalPayable || total}</td>
        <td>${data.paymentMethod || "N/A"}</td>
        <td>${data.additionalInfo?.address || "No Address"}</td>
      </tr>
    `;
  });
}
