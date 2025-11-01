// Scroll effect for header
window.addEventListener("scroll", function() {
    const header = document.querySelector(".fixed");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

const basketBody = document.getElementById("basketBody");
const totalPriceElement = document.querySelector("#price");
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderBasket();
    updateCartCount();
});

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Delete product from cart
function deleteProduct(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderBasket();
    updateCartCount();
}

// Update product quantity
function updateQuantity(id, change) {
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity < 1) {
            deleteProduct(id);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderBasket();
        updateCartCount();
    }
}

// Render the cart using template
function renderBasket() {
    if (!basketBody) return;
    
    // Clear existing content
    basketBody.innerHTML = '';
    
    if (cartItems.length === 0) {
        basketBody.innerHTML = '<tr><td colspan="7" class="text-center">Your cart is empty</td></tr>';
        if (totalPriceElement) {
            totalPriceElement.textContent = '0.00 ₾';
        }
        return;
    }

    const template = document.getElementById('basketItemTemplate');
    let total = 0;

    cartItems.forEach(item => {
        const clone = template.content.cloneNode(true);
        const tr = clone.querySelector('tr');
        
        // Set up the row
        const img = clone.querySelector('.item-image');
        img.src = item.image || '';
        img.alt = item.name || '';
        
        // Update the template with item data
        clone.querySelector('.item-name').textContent = item.name || '';
        clone.querySelector('.item-price').textContent = item.price ? `${item.price.toFixed(2)} ₾` : '0.00 ₾';
        
        // Set up quantity controls
        const quantityElement = clone.querySelector('.item-quantity');
        quantityElement.textContent = item.quantity || 1;
        
        // Set up spicy and nuts indicators
        clone.querySelector('.item-spicy').textContent = item.spiciness || 'No';
        clone.querySelector('.item-nuts').textContent = item.nuts ? 'Yes' : 'No';
        
        // Set up delete button
        const deleteBtn = clone.querySelector('.delete-btn');
        deleteBtn.onclick = (e) => {
            e.preventDefault();
            deleteProduct(item.id);
        };
        
        // Calculate item total
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        total += itemTotal;
        
        basketBody.appendChild(clone);
    });

    // Update total price
    if (totalPriceElement) {
        totalPriceElement.textContent = `${total.toFixed(2)} ₾`;
    }
}