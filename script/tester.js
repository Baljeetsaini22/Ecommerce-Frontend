fetch("https://dummyjson.com/products")
  .then(
    response.json().then((products) => {
      const grid = document.getElementById("product-grid");
      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h4>${product.title}</h4>
          <p><strong>$${product.price}</strong></p>
          <button onclick="alert('Added to Cart: ${product.title}' class="cart-btn")">Add to Cart</button>
        `;
        grid.appendChild(card);
      });
    })
  )
  .catch((err) => console.error("Error loading products:", err));
