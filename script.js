const cart = {};

function showSection(id) {
    document.querySelectorAll('.content').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const startBanner = document.getElementById('start-banner');
    if (startBanner) {
        if (id === 'start') {
            startBanner.style.display = 'block';
        } else {
            startBanner.style.display = 'none';
        }
    }
}


function toggleSubMenu() {
    const submenu = document.getElementById('submenu');
    const arrow = document.getElementById('feier-arrow');

    submenu.classList.toggle('hidden');
    arrow.classList.toggle('rotated');
}


function showNotification() {
    const note = document.getElementById('cart-notification');
    note.classList.add('show');
    setTimeout(() => note.classList.remove('show'), 2000);
}

function updateCartCount() {
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    const counter = document.getElementById('cart-count');
    if (count > 0) {
        counter.style.display = 'inline';
        counter.textContent = count;
    } else {
        counter.style.display = 'none';
    }
}

function addToCart(item) {
    cart[item] = (cart[item] || 0) + 1;
    updateCartCount();
    showNotification();
}

function removeFromCart(itemName) {
    if (cart[itemName]) {
        cart[itemName]--;
        if (cart[itemName] <= 0) {
            delete cart[itemName];
        }
        updateCartCount();
    }
    event?.preventDefault();
    event?.stopPropagation();
}


function deleteFromCart(item) {
    delete cart[item];
    updateCartCount();
    showCart();
}

function showCart() {
    showSection('cart');
    const cartItems = document.getElementById('cart-items');
    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = "<p>Der Warenkorb ist leer.</p>";
        return;
    }

    cartItems.innerHTML = '<ul>' + Object.entries(cart).map(([k, v]) =>
        `<li>${k}: ${v}
      <button onclick="addToCart('${k}')">+</button>
      <button onclick="removeFromCart('${k}')">−</button>
      <button onclick="deleteFromCart('${k}')">🗑️</button>
    </li>`
    ).join('') + '</ul>';
}

function submitOrder() {
    console.log("submitOrder aktiv")
    const message = document.getElementById('message').value;
    const email = document.getElementById('email').value;

    fetch('https://partyservice-backend.onrender.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, message, email, info_code: honeypot })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'ok') {
            alert('Bestellung abgeschickt!');
            Object.keys(cart).forEach(k => delete cart[k]);
            updateCartCount();
            showCart();
        } else {
            alert('Fehler beim Senden: ' + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Verbindung zum Server fehlgeschlagen.');
    });
}
