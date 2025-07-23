// contact.js

// Import Firebase (Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate email with RegEx
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        subject,
        message,
        createdAt: serverTimestamp(),
      });

      // Send Email via EmailJS
      await sendEmail(name, email, subject, message);

      alert("Message sent successfully! Thank you for contacting us.");
      form.reset();
      form.classList.remove("was-validated");

    } catch (error) {
      console.error("Error:", error);
      alert("There was an error. Please try again later.");
    }
  });
});

// EmailJS send function
function sendEmail(name, email, subject, message) {
  const serviceID = "service_clhsldf";
  const templateID = "template_5nc0s27";
  const publicKey = "D8yWhy2r676bIGDiV";

  return emailjs.send(serviceID, templateID, {
    name,
    email,
    subject,
    message,
  }, publicKey)
  .then((response) => {
    console.log("Email sent:", response.status, response.text);
  })
  .catch((err) => {
    console.error("Email send failed:", err);
    throw err;
  });
}


function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
