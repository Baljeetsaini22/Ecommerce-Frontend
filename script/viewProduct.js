const path = window.location.pathname;

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cart.length > 0) {
        cartCountEl.innerHTML = cart.length;;
    } else {
        cartCountEl.innerHTML = 0;
    }
}

// ✅ Call on every page load to show cart count
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

if (path.includes("productsView.html")) {
    const itemShow = document.querySelectorAll(".itemShow");
    const waiting = document.getElementById("waiting");

    function productsLoad() {
        waiting.style.display = "block";
        itemShow.innerHTML = "";

        fetch('https://fakestoreapiserver.reactbd.com/walmart')
            .then(response => response.json())
            .then(data => {
                waiting.style.display = "none";

                if (!data || data.length === 0) {
                    itemShow.innerHTML = "<p>No products found.</p>";
                    return;
                }

                const container = document.getElementById('itemShow');
                data.forEach(item => {
                    const image = item.image || item.image?.[0];
                    const price = Math.floor(item.price * 80);
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';

                    let title = item.title.slice(0, 22);
                    console.log(title);
                    

                    productDiv.innerHTML = `
                    <div class="item">
                        <div class="item-details">
                            <div class="image-cartBtn">
                                <a href='../pages/product.html?id=${item._id}'>
                                    <img src="${image}" alt="${item.title}" loading="lazy" class="item-img"/>
                                </a>
                                </div>
                                <button 
                  class="cart-btn"
                  data-id="${item._id}"
                  data-title="${item.title}"
                  data-price="${price}"
                  data-image="${image}"
                >
                  <span>Add to Cart</span>
                </button>
                            <h3>${title}</h3>
                            <p>Price: ₹${price}</p>
                            
                        </div>
                    </div>
                    `;

                    container.appendChild(productDiv);
                });
                attachCartListeners()
            })
            .catch(error => console.error('Error fetching products:', error));


    }
    function attachCartListeners() {
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const title = this.dataset.title;
        const price = parseFloat(this.dataset.price);
        const image = this.dataset.image;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item.id === id);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ id, title, price, image, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
        alert("Item added to cart!");
      });
    });
  }
    productsLoad()
}