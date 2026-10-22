document.addEventListener("DOMContentLoaded", () => {
    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }

    // Update the cart count immediately when the page loads
    updateCartCount(); // Ensure cart count is set as soon as the page is loaded

    // Navigation functionality
    const navLinks = document.querySelectorAll(".main-navigation ul li a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop();
        link.classList.toggle("active", linkPage === currentPage);

        // Manual click handling
        link.addEventListener("click", () => {
            navLinks.forEach(nav => nav.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Category and price range toggle functionality
    document.querySelectorAll(".toggle-button").forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            toggleVisibility(targetId, button);
        });
    });

    // Price Range Handling
    const priceRange = document.getElementById('price-range');
    const priceLabels = document.querySelectorAll('.price-values span');
    const products = document.querySelectorAll('.product');

    if (priceRange && priceLabels.length && products.length) {
        // Show all products initially
        products.forEach(product => product.style.display = "block");

        // Update price labels and filter products
        function updatePriceLabels() {
            const maxPrice = parseFloat(priceRange.value);
            priceLabels[0].textContent = `₱${maxPrice.toFixed(2)}`;
            filterProducts(maxPrice);
        }

        function filterProducts(maxPrice) {
            products.forEach(product => {
                const productPrice = parseFloat(product.getAttribute('data-price'));
                product.style.display = productPrice <= maxPrice ? "block" : "none";
            });
        }

        // Set initial slider labels but do not filter
        const initialMaxPrice = parseFloat(priceRange.value);
        priceLabels[0].textContent = `₱${initialMaxPrice.toFixed(2)}`;

        // Add event listener for slider adjustments
        priceRange.addEventListener('input', updatePriceLabels);
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const product = button.closest('.product');
            const { name, description, price, image } = product.dataset;
            addToCart(name, description, parseFloat(price), image);
        });
    });

    function addToCart(name, description, price, image) {
        try {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if the product already exists in the cart
            const isProductInCart = cart.some(product => product.name === name);
            
            if (isProductInCart) {
                alert(`${name} is already in your cart.`);
            } else {
                cart.push({ name, description, price, image });
                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${name} has been added to your cart!`);
            }
            
            updateCartCount(); // Update cart count after adding item
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            sortProducts(sortSelect.value);
        });
    }

    function sortProducts(option) {
        const productGrid = document.querySelector('.product-grid');
        const productArray = Array.from(productGrid.children);

        productArray.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));

            if (option === 'low-to-high') return priceA - priceB;
            if (option === 'high-to-low') return priceB - priceA;
            return 0;
        });

        // Reorder products in the grid
        productArray.forEach(product => productGrid.appendChild(product));
    }

    // Load cart and display items
    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cart.length ?
                cart.map((product, index) => `
                    <div class="product">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <button class="remove-from-cart" data-index="${index}">Remove from Cart</button>
                    </div>
                `).join('') :
                '<p>Your cart is empty.</p>';
            
            // Attach event listeners for removing items
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    removeFromCart(index);
                });
            });
        }
    }

    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount(); // Ensure cart count updates after item removal
        alert('Item removed from your cart.');
    }

    function clearCart() {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount(); // Ensure cart count updates after clearing
        alert('Your cart has been cleared.');
    }

    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            alert(username && password ? 'Login successful!' : 'Please enter both username and password.');
        });
    }

    // Create account form validation
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;

            if (!firstName || !lastName || !email || !phone) {
                alert("Please fill out all required fields.");
                event.preventDefault();
            }
        });
    }
});

// Function to toggle visibility
function toggleVisibility(targetId, button) {
    const target = document.getElementById(targetId);
    if (target) {
        const isVisible = target.style.display === "block";
        target.style.display = isVisible ? "none" : "block";
        if (button) button.textContent = isVisible ? "+" : "-";
    }
}






//SA CART
