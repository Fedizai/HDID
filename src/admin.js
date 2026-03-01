// src/admin.js

const ADMIN_EMAIL_1 = 'fedizayen11@gmail.com';
const ADMIN_EMAIL_2 = 'fedizayen11@gmal.com';
const CONTENT_KEY = 'hdid_custom_content';
const CUSTOM_PRODUCTS_KEY = 'hdid_custom_products';

// Check if current user is an admin
function isAdmin() {
    const session = localStorage.getItem('hdid_current_user');
    if (!session) return false;
    try {
        const user = JSON.parse(session);
        return user && (user.email === ADMIN_EMAIL_1 || user.email === ADMIN_EMAIL_2);
    } catch (e) {
        return false;
    }
}

// Get saved custom content
function getSavedContent() {
    return JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
}

// Save custom content block
function saveContent(editId, text) {
    const content = getSavedContent();
    content[editId] = text;
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

// Hydrate page with saved content
function hydrateContent() {
    const content = getSavedContent();
    Object.keys(content).forEach(editId => {
        const el = document.querySelector(`[data-edit-id="${editId}"]`);
        if (el) {
            el.innerHTML = content[editId];
        }
    });
}

// Enable inline editing for admin
function enableTextEditing() {
    const editableElements = document.querySelectorAll('[data-edit-id]');

    // Add edit styles to the document
    const style = document.createElement('style');
    style.innerHTML = `
        [data-edit-id] {
            position: relative;
            transition: outline 0.2s;
        }
        [data-edit-id]:hover {
            outline: 2px dashed var(--accent-color);
            cursor: text;
        }
        [data-edit-id]:focus {
            outline: 2px solid var(--accent-color);
            background: rgba(255, 255, 255, 0.1);
        }
        .admin-add-product-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.05);
            border: 2px dashed #ccc;
            border-radius: var(--border-radius-md);
            min-height: 400px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .admin-add-product-card:hover {
            background: rgba(0, 0, 0, 0.1);
            border-color: var(--accent-color);
        }
    `;
    document.head.appendChild(style);

    // Make elements editable
    editableElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');

        el.addEventListener('blur', (e) => {
            const editId = el.getAttribute('data-edit-id');
            const newText = el.innerHTML;
            saveContent(editId, newText);
        });
    });
}

// --- Custom Products Logic ---

function getCustomProducts() {
    return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
}

function saveCustomProduct(product) {
    const products = getCustomProducts();
    product.id = 'custom_' + Date.now();
    products.push(product);
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
    window.location.reload(); // Quick visual update
}

function renderCustomProducts() {
    const products = getCustomProducts();
    if (products.length === 0) return;

    // We only want to add these to grids on index.html and shop.html realistically,
    // where `.product-grid` exists.
    const grids = document.querySelectorAll('.product-grid');
    grids.forEach(grid => {
        if (grid.id === 'wishlist-grid' || grid.id === 'search-grid') return; // Skip dynamic ones

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in-up';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-img">
                    <div class="product-overlay">
                        <a href="#" class="btn btn-primary quick-add">View Product</a>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category || 'Collection'}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                </div>
            `;
            grid.appendChild(card);
        });
    });
}

function enableAddProductMode() {
    const grids = document.querySelectorAll('.product-grid');
    grids.forEach(grid => {
        if (grid.id === 'wishlist-grid' || grid.id === 'search-grid') return;

        const addCard = document.createElement('div');
        addCard.className = 'admin-add-product-card fade-in-up';
        addCard.innerHTML = `
            <div style="font-size: 3rem; color: #ccc;">+</div>
            <div style="font-weight: bold; margin-top: 10px; color: #888;">Add Product</div>
        `;

        addCard.addEventListener('click', () => {
            const name = prompt("Enter product name:");
            if (!name) return;
            const price = prompt("Enter product price (e.g. 120.00):");
            if (!price) return;
            // Provide a default image if they just hit enter
            let imageUrl = prompt("Enter image URL (or leave blank for a placeholder):");
            if (!imageUrl) imageUrl = "https://via.placeholder.com/400x500?text=New+Product";

            saveCustomProduct({
                name,
                price: parseFloat(price).toFixed(2),
                imageUrl,
                category: 'Collection'
            });
        });

        grid.appendChild(addCard);
    });
}

// Initialize Admin System
document.addEventListener('DOMContentLoaded', () => {
    // 1. Everyone gets hydrated content and custom products rendered
    hydrateContent();
    renderCustomProducts();

    // 2. Only Admins get the editing tools
    if (isAdmin()) {
        console.log("Admin Mode Active: Inline editing enabled for " + ADMIN_EMAIL_1);
        enableTextEditing();
        enableAddProductMode();
    }
});
