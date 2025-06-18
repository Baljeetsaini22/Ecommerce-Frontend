//!=============================================================================
document.addEventListener("DOMContentLoaded", () => { updateCartCount();

const path = window.location.pathname; 
API_URL = "https://fakestoreapiserver.reactbd.com/walmart"; 
if (path.includes("index.html") || path === "/") {}
if (path.includes("product.html")) {}


if (path.includes("index.html") || path.endsWith("/")) { ProductLoad();} 

else if (path.includes("product.html")) { 
  const id = new
  URLSearchParams(window.location.search).get("id"); 
  if (id) showProductById(id); 
}
else if (path.includes("cart.html")) {showCartItems(); } 







/** 
 * @description this is used for Add to cart items 
 * @returns add items in cart by user 
 * @function ProductLoad() 
*/ 

function ProductLoad() { 
 
  const items = document.querySelector(".items"); 
  const loading = document.getElementById("loading"); 
  function loadProducts() {
    loading.style.display = "block"; 
    items.innerHTML = ""; 
    fetch(API_URL)
    .then((response) => response.json()) 
    .then((data) => {
      loading.style.display = "none"; 
      if (!products || products.length === 0) {
        items.innerHTML = 
        <p>No products found.</p>
        return; } 
        data.forEach((item) => { const image = item.image || item.image?.[0]; const card = `
          <div class="item">
 
  <div class="item-details">
   
    <div class="image-cartBtn">
     
      <a href="../pages/product.html?id=${item._id}">
       
        <img
          src="${image}"
          alt="${
              item.title
            }"
          loading="lazy"
          class="item-img"
        />
       
      </a>
     
    </div>
   
    <button
      class="cart-btn"
      onclick="addToCart(${
                  item._id
                }')"
    >
      <span>Add to Cart</span>
    </button>
   
    <h4 class="item-title">${item.title}</h4>
   
    <p class="item-price">
      <strong>₹${Math.floor( item.price * 80 )}</strong>
    </p>
   
  </div>
 
</div>
`; items.innerHTML += card; }); }) .catch((err) => {
console.error("Error loading products:", err); loading.textContent = "Failed
to load products."; }); } loadProducts(); } } ProductLoad();
/** * @description this is used for Add to cart items * @returns add
items in cart by user * @function ProductDetails() */ function
ProductDetails() 




{  const params = new
URLSearchParams(window.location.search); const productId = params.get("id");
fetch(API_URL) .then((response) => response.json()) .then((data) => {
const product = data.find( (item) => String(item._id) ===
String(productId) ); const DiscountPrice = ((product.price -
product.oldPrice) / product.oldPrice) * 100 || 0; const lessPrice =
DiscountPrice.toFixed(0) + "%"; const MrP = Math.floor(product.oldPrice ||
product.price) * 80; if (product) {
document.getElementById("product-container").innerHTML = `
<div class="container">
 
  <div class="about-product">
   
    <div class="product-img">
      <img src="${product.image}" alt="${product.title}" width="150" />
    </div>
   
    <div class="description">
     
      <h2>${product.des}</h2>
     
      <div>
       
        <p>
          <span class="lessPrice">${lessPrice}</span> ₹${Math.floor(
          product.price * 80 )}
        </p>
        <span>M.R.P.:<del>₹${MrP}</del></span>
      </div>
     
      <button class="cart-btn" id="udateItem"><span>Add to Cart</span></button>
     
      <hr />
     
      <p><strong>Title:</strong> ${product.title}</p>
     
      <p><strong>Brand:</strong> ${product.brand}</p>
     
      <p><strong>Category:</strong> ${product.category}</p>
     
    </div>
   
  </div>
 
</div>
`; } else { document.getElementById("product-container").innerText =
"Product not found."; } }) .catch((error) => { console.error("Error
fetching product:", error);
document.getElementById("product-container").innerText = "Failed to load
product."; }); function changeQty(change) { quantity = Math.max(1,
quantity + change); document.getElementById("qty").innerText = quantity;
updateTotal(); } function addToCart(id) { const item = { ...product,
quantity }; let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.push(item); localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to cart"); } } } ProductDetails(); function
updateCart() { const updateCart = document.getElementById('udateItem')
updateCart.addEventListener('click', function(e){ e.preventDefault()
return alert('Hello Word') }) }