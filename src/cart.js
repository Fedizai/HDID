export function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('hdid_cart')) || [];
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('hdid_cart', JSON.stringify(cart));

    // Quick little visual feedback
    const btn = event.target;
    const oldText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.backgroundColor = "green";
    btn.style.color = "white";
    setTimeout(() => {
        btn.innerText = oldText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
    }, 1000);
}

export function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('hdid_cart')) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('hdid_cart', JSON.stringify(cart));
    renderCart();
}

export function updateQuantity(name, change) {
    let cart = JSON.parse(localStorage.getItem('hdid_cart')) || [];
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    localStorage.setItem('hdid_cart', JSON.stringify(cart));
    renderCart();
}

export function renderCart() {
    const emptyState = document.querySelector('.cart-empty-state');
    const itemsContainer = document.getElementById('cart-items-container');
    const totalContainer = document.getElementById('cart-total-container');

    if (!emptyState || !itemsContainer || !totalContainer) return;

    let cart = JSON.parse(localStorage.getItem('hdid_cart')) || [];

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        itemsContainer.style.display = 'none';
        totalContainer.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    itemsContainer.style.display = 'block';
    totalContainer.style.display = 'block';

    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item fade-in-up';
        itemEl.style.display = 'flex';
        itemEl.style.gap = 'var(--spacing-md)';
        itemEl.style.padding = 'var(--spacing-md)';
        itemEl.style.borderBottom = '1px solid var(--border-color)';
        itemEl.style.alignItems = 'center';
        itemEl.style.backgroundColor = 'var(--surface-color)';
        itemEl.style.borderRadius = 'var(--border-radius-md)';
        itemEl.style.marginBottom = 'var(--spacing-sm)';

        itemEl.innerHTML = `
            <div style="width: 100px; height: 100px; background: transparent; border-radius: var(--border-radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${item.name}</h3>
                <p style="margin: 0; color: var(--text-secondary);">$${item.price.toFixed(2)}</p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn" style="padding: 0.2rem 0.5rem; min-width: 30px;" onclick="window.cartUtils.updateQuantity('${item.name}', -1)">-</button>
                    <span style="font-weight: bold; width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="btn" style="padding: 0.2rem 0.5rem; min-width: 30px;" onclick="window.cartUtils.updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
            <div style="font-weight: bold; font-size: 1.1rem; margin-right: 1rem;">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="icon-btn" style="color: #ff4d4d;" aria-label="Remove item" onclick="window.cartUtils.removeFromCart('${item.name}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        itemsContainer.appendChild(itemEl);
    });

    totalContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-lg) 0; border-top: 2px solid var(--text-primary); margin-top: var(--spacing-lg);">
            <h2 style="margin: 0;">Total</h2>
            <h2 style="margin: 0;">$${total.toFixed(2)}</h2>
        </div>
        <button class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;" onclick="window.location.href='checkout.html'">Proceed to Checkout</button>
    `;
}

// Make functions globally available so inline onclick can use them
window.cartUtils = {
    addToCart,
    removeFromCart,
    updateQuantity
};

// Initialize render on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        renderCart();
    });
}
