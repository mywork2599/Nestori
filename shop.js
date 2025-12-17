// Shop functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('nestoriCart') || '[]');
    updateCartDisplay();

    // Add to cart and remove from cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productName = e.target.getAttribute('data-product');
            const productPrice = parseInt(e.target.getAttribute('data-price'));

            // Add item to cart
            cart.push({ name: productName, price: productPrice });

            // Save to localStorage
            localStorage.setItem('nestoriCart', JSON.stringify(cart));

            // Update display
            updateCartDisplay();

            // Show feedback
            alert(`${productName} added to cart!`);
        } else if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));

            // Remove item from cart
            const removedItem = cart.splice(index, 1)[0];

            // Save to localStorage
            localStorage.setItem('nestoriCart', JSON.stringify(cart));

            // Update display
            updateCartDisplay();

            // Show feedback
            alert(`${removedItem.name} removed from cart!`);
        }
    });

    // Category filtering
    document.querySelectorAll('.categories a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        searchProducts(searchTerm);
    });

    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            searchProducts(searchTerm);
        }
    });
});

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('nestoriCart') || '[]');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');

    // Update cart count
    cartCount.textContent = cart.length;

    // Update cart items display
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price.toLocaleString()}</span>
            <button class="btn btn-sm btn-danger remove-item" data-index="${index}">×</button>
        `;
        cartItems.appendChild(itemDiv);
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function searchProducts(searchTerm) {
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const productName = product.querySelector('h5').textContent.toLowerCase();
        const productDesc = product.querySelector('p').textContent.toLowerCase();

        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
