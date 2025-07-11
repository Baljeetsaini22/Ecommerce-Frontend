// function togglePassword(id) {
//   const field = document.getElementById(id);
//   field.type = field.type === "password" ? "text" : "password";
// }

// function showSignup() {
//   document.getElementById("loginForm").classList.add("d-none");
//   document.getElementById("signupForm").classList.remove("d-none");
// }

// function showLogin() {
//   document.getElementById("signupForm").classList.add("d-none");
//   document.getElementById("loginForm").classList.remove("d-none");
// }

// function validateEmail(email) {
//   return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
// }

// function checkStrength(password) {
//   const strengthEl = document.getElementById("strength");
//   let strength = "Weak";
//   if (
//     password.length >= 8 &&
//     /[A-Z]/.test(password) &&
//     /[a-z]/.test(password) &&
//     /\d/.test(password)
//   ) {
//     strength = "Strong";
//   } else if (password.length >= 6) {
//     strength = "Medium";
//   }
//   strengthEl.textContent = `Password strength: ${strength}`;
// }

// document.getElementById("signupForm").onsubmit = function (e) {
//   e.preventDefault();

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("signupEmail").value;
//   const password = document.getElementById("signupPassword").value;
//   const confirm = document.getElementById("confirmPassword").value;

//   if (!validateEmail(email)) {
//     alert("Invalid email format.");
//     return;
//   }

//   if (password !== confirm) {
//     alert("Passwords do not match.");
//     return;
//   }

//   if (
//     password.length < 8 ||
//     !/[A-Z]/.test(password) ||
//     !/[a-z]/.test(password) ||
//     !/\d/.test(password)
//   ) {
//     alert("Password must contain uppercase, lowercase, and a number.");
//     return;
//   }
//   const user = { name, email, password };
//   localStorage.setItem("auth", JSON.stringify(user));
//   window.location.href = "/";
// };

// document.getElementById("loginForm").onsubmit = function (e) {
//   e.preventDefault();
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   if (!validateEmail(email)) {
//     alert("Invalid email format.");
//     return;
//   }

//   if (!password) {
//     alert("Password required.");
//     return;
//   }

//   alert("Login successful!");
// };

// const showLoginUser = document.querySelector(".login");

// const getUserAuth = JSON.parse(localStorage.getItem("auth"));
// console.log(getUserAuth);
// if (!getUserAuth) {
//   showLoginUser.innerHTML = "Login";
// } else {
//   showLoginUser.innerHTML = `Hi! ${getUserAuth.name}`;
// }


function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

function showSignup() {
  document.getElementById("loginForm").classList.add("d-none");
  document.getElementById("signupForm").classList.remove("d-none");
}

function showLogin() {
  document.getElementById("signupForm").classList.add("d-none");
  document.getElementById("loginForm").classList.remove("d-none");
}

function validateEmail(email) {
  return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
}

function checkStrength(password) {
  const strengthEl = document.getElementById("strength");
  let strength = "Weak";
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  ) {
    strength = "Strong";
  } else if (password.length >= 6) {
    strength = "Medium";
  }
  strengthEl.textContent = `Password strength: ${strength}`;
}

// Signup Form Submit
document.getElementById("signupForm").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!validateEmail(email)) {
    alert("Invalid email format.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    alert("Password must contain uppercase, lowercase, and a number.");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("auth", JSON.stringify(user));
  alert("Signup successful! Please log in.");
  showLogin(); // Redirect to login form
};

// Login Form Submit
document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const savedUser = JSON.parse(localStorage.getItem("auth"));

  if (!validateEmail(email)) {
    alert("Invalid email format.");
    return;
  }

  if (!password) {
    alert("Password required.");
    return;
  }

  if (!savedUser || email !== savedUser.email || password !== savedUser.password) {
    alert("Incorrect email or password.");
    return;
  }

  localStorage.setItem("isLogin", "true");
  alert("Login successful!");
  window.location.href = "/"; // Redirect to homepage after login
};

// Show login status on homepage (index.html)
const showLoginUser = document.querySelector(".login");
const getUserAuth = JSON.parse(localStorage.getItem("auth"));
const isLogin = localStorage.getItem("isLogin");

if (showLoginUser) {
  if (getUserAuth && isLogin === "true") {
    showLoginUser.innerHTML = `Hi! ${getUserAuth.name}`;
  } else {
    showLoginUser.innerHTML = `<a href="../pages/auth.html">Login</a>`;
  }
}
