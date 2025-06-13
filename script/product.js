function ProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch("https://fakestoreapiserver.reactbd.com/walmart")
    .then((response) => response.json())
    .then((data) => {
      const product = data.find(
        (item) => String(item._id) === String(productId)
      );

      if (product) {
        document.getElementById("product-container").innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}" width="150" />
            <p>Price: ₹ ${Math.floor(product.price * 80)} <del> ₹ ${Math.floor(
          product.oldPrice * 80
        )} </del></p>c
            <p>${product.des}</p>
            <p>${product.category}</p>
            
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
