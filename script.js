let allProducts = [];
let currentCategoryId = 0;

// --------------header
window.addEventListener("scroll", function() {
    const header = document.querySelector(".fixed");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// ---------------- category
const categoryContainer = document.querySelector(".category-inline");

async function loadCategories() {
    try {
        const response = await fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll");
        const data = await response.json();

        // Add All button
        const allBtn = document.createElement("button");
        allBtn.textContent = "All";
        allBtn.classList.add("category-btn", "active");
        allBtn.dataset.id = "0";
        allBtn.addEventListener("click", () => {
            currentCategoryId = 0;
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            allBtn.classList.add("active");
            filterProducts();
        });
        categoryContainer.appendChild(allBtn);

        // Add category buttons
        data.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("category-btn");
            btn.dataset.id = category.id;

            btn.addEventListener("click", () => {
                currentCategoryId = category.id;
                document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                filterProducts();
            });

            categoryContainer.appendChild(btn);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// -------------- filter
const spiceRange = document.getElementById("range");
const spiceLabel = document.getElementById("spiceLabel");
const resetBtn = document.getElementById("resetBtn");
const applyBtn = document.getElementById("applyBtn");
const noNutsCheckbox = document.getElementById("noNuts");
const vegetarianCheckbox = document.getElementById("vegeterian");

spiceRange.addEventListener("input", () => {
    const value = Number(spiceRange.value);
    let text = "Not Chosen";

    switch (value) {
        case 0: text = "Not Chosen"; break;
        case 1: text = "0"; break;
        case 2: text = "1"; break;
        case 3: text = "2"; break;
        case 4: text = "3"; break;
        case 5: text = "4"; break;
    }

    spiceLabel.textContent = `Spiciness: ${text}`;
});

resetBtn.addEventListener("click", () => {
    spiceRange.value = 0;
    spiceLabel.textContent = "Spiciness: Not Chosen";
    noNutsCheckbox.checked = false;
    vegetarianCheckbox.checked = false;
    filterProducts();
});

applyBtn.addEventListener("click", filterProducts);

function filterProducts() {
    let filteredProducts = [...allProducts];
    
    if (currentCategoryId !== 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.categoryId === currentCategoryId
        );
    }
    
    const spiceLevel = Number(spiceRange.value);
    if (spiceLevel > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.spiciness === (spiceLevel - 1)
        );
    }
    
    if (noNutsCheckbox.checked) {
        filteredProducts = filteredProducts.filter(product => !product.nuts);
    }
    
    if (vegetarianCheckbox.checked) {
        filteredProducts = filteredProducts.filter(product => product.vegeterian);
    }
    
    const container = document.getElementById('products');
    container.innerHTML = ''; 
    renderProducts(filteredProducts);
}

// ------------- product 
async function loadProducts() {
    try {
        const response = await fetch('https://restaurant.stepprojects.ge/api/Products/GetAll');
        allProducts = await response.json();
        filterProducts(); 
    } catch (error) {
        console.error('Error loading products:', error);
    }
}


function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}


function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartText = document.querySelector('.cart-text');
    
    if (cartText) {
        cartText.textContent = `Cart (${cartCount})`;
    }
}

// Show notification when product is added to cart
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

function renderProducts(products) {
    const container = document.getElementById('products');
    const template = document.getElementById('product-template');

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">No products found matching your filters.</p>';
        return;
    }

    products.forEach(product => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector(".product-img").src = product.image;
        clone.querySelector(".product-img").alt = product.name;
        clone.querySelector(".product-name").textContent = product.name;
        clone.querySelector(".product-price").textContent = `${product.price} ₾`;
        
        const nutsElement = clone.querySelector(".nuts");
        if (product.nuts) {
            nutsElement.textContent = "🌰 Contains Nuts";
            nutsElement.style.color = "#ff4d4f";
        } else {
            nutsElement.textContent = "✅ Nut-free";
            nutsElement.style.color = "#52c41a";
        }
        
        const vegetarianElement = clone.querySelector(".vegeteriann");
        if (product.vegeterian) {
            vegetarianElement.textContent = "🌿 Vegetarian";
            vegetarianElement.style.color = "#52c41a";
        } else {
            vegetarianElement.textContent = "🍗 Non-Vegetarian";
            vegetarianElement.style.color = "#ff4d4f";
        }
        
        const spicinessElement = clone.querySelector(".spicy");
        const spiciness = product.spiciness || 0;
        spicinessElement.textContent = "🌶️".repeat(spiciness) || "No spiciness";
        
        const addToCartBtn = clone.querySelector(".add-btn");
        addToCartBtn.addEventListener("click", () => {
            addToCart(product);
        });
        
        container.appendChild(clone);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    loadCategories();
    loadProducts();
    updateCartCount();
});