// ===============================
// Product Data
// ===============================

const productCards = document.querySelectorAll(".product-card");

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];


// ===============================
// Cart Elements
// ===============================

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


// ===============================
// Open / Close Cart
// ===============================

function openCart() {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartBtn.addEventListener("click", openCart);

closeCart.addEventListener("click", closeCartSidebar);

overlay.addEventListener("click", closeCartSidebar);


// ===============================
// Add Product to Cart
// ===============================

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product-card");

        const name = product.dataset.name;
        const price = Number(product.dataset.price);
        const category = product.dataset.category;
        const image = product.querySelector(".product-image").childNodes[0]
            .textContent.trim();

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name,
                price,
                category,
                image,
                quantity: 1
            });
        }

        saveCart();
        updateCart();

        openCart();

    });

});


// ===============================
// Update Cart
// ===============================

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty 🛒
            </p>
        `;

    } else {

        cart.forEach((item, index) => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    ${item.image}
                </div>

                <div>
                    <h4>${item.name}</h4>

                    <p>
                        ₹${item.price.toLocaleString("en-IN")}
                    </p>

                    <div class="quantity">

                        <button onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>
                </div>

                <button
                    class="remove-item"
                    onclick="removeItem(${index})">
                    ✕
                </button>
            `;

            cartItems.appendChild(cartItem);

        });

    }

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    cartTotal.textContent =
        `₹${totalPrice.toLocaleString("en-IN")}`;
}


// ===============================
// Change Quantity
// ===============================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}


// ===============================
// Remove Item
// ===============================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();
    updateCart();
}


// ===============================
// Local Storage
// ===============================

function saveCart() {

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

}


// ===============================
// Product Filtering
// ===============================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const noProducts =
    document.getElementById("noProducts");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        filterProducts(filter);

    });

});


function filterProducts(filter) {

    let visibleProducts = 0;

    productCards.forEach(product => {

        const category = product.dataset.category;

        if (filter === "All" || category === filter) {

            product.style.display = "block";
            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });

    noProducts.style.display =
        visibleProducts === 0 ? "block" : "none";
}


// ===============================
// Category Buttons
// ===============================

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        document.querySelector("#products")
            .scrollIntoView({
                behavior: "smooth"
            });

        filterButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === category
            );

        });

        filterProducts(category);

    });

});


// ===============================
// Search
// ===============================

const searchInput =
    document.getElementById("searchInput");

const mobileSearch =
    document.getElementById("mobileSearch");

function searchProducts(value) {

    const searchTerm = value.toLowerCase().trim();

    let found = 0;

    productCards.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        const category =
            product.dataset.category.toLowerCase();

        if (
            name.includes(searchTerm) ||
            category.includes(searchTerm)
        ) {

            product.style.display = "block";
            found++;

        } else {

            product.style.display = "none";

        }

    });

    noProducts.style.display =
        found === 0 ? "block" : "none";

}


searchInput.addEventListener("input", event => {
    searchProducts(event.target.value);
});

mobileSearch.addEventListener("input", event => {
    searchProducts(event.target.value);
});


// ===============================
// Mobile Menu
// ===============================

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

});

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

});


// ===============================
// Contact Form
// ===============================

const contactForm =
    document.getElementById("contactForm");

const contactResponse =
    document.getElementById("contactResponse");

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    contactResponse.textContent =
        "Thank you! Your message has been received.";

    contactForm.reset();

});


// ===============================
// Checkout
// ===============================

const checkoutBtn =
    document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    alert(
        "Thank you for shopping with ShopEase! " +
        "This is a demo checkout."
    );

});


// ===============================
// Initialize
// ===============================

updateCart();
