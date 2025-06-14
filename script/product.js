

/**
 * @description this page for item details 
 * @returns Full details of Products and add to cart 
 * @function ProductDetails()
 */

function ProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch("https://fakestoreapiserver.reactbd.com/walmart")
    .then((response) => response.json())
    .then((data) => {
      const product = data.find(
        (item) => String(item._id) === String(productId)
      );
      const DiscountPrice = ((product.price - product.oldPrice) / product.oldPrice) * 100 || 0;
      const lessPrice = DiscountPrice.toFixed(0) + "%";
      const MrP = Math.floor(product.oldPrice || product.price)* 80;
      if (product) {
        document.getElementById("product-container").innerHTML = `
        <div class="container">
          <div class="about-product">
            <div class="product-img">
              <img src="${product.image}" alt="${product.title}" width="150" />
            </div>
            <div class="description">
              
              <h2>${product.des}</h2>
              <div>              
              <p> <span class="lessPrice">${lessPrice} </span> ₹ ${Math.floor(product.price * 80)}</p>
              <span>M.R.P.:<del>₹${MrP}</del></span>
              </div>
              <button class="cart-btn" onclick="addToCart('${product.title.replace(
                  /'/g,
                  "\\'"
                )}')"><span>Add to Cart</span></button>
              <hr/>
              <p> <strong>Title: </strong>${product.title}</p>
              <p> <strong>Brand: </strong> ${product.brand}</p>
              <p> <strong>Category: </strong> ${product.category}</p>
            </div>
          </div>
          
        </div>
          `;
      } else {
        document.getElementById("product-container").innerText =
          "Product not found.";
      }
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      document.getElementById("product-container").innerText =
        "Failed to load product.";
    });
}
ProductDetails();

