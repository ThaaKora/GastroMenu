const cart = {};

function showSection(id) {
    document.querySelectorAll('.content').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const startBanner = document.getElementById('start-banner');
    if (startBanner) {
        startBanner.style.display = (id === 'start') ? 'block' : 'none';
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
    if ((cart[item] || 0) >= 10) {
        alert("Maximal 10 Stück pro Artikel erlaubt.");
        return;
    }
    cart[item] = (cart[item] || 0) + 1;
    updateCartCount();
    showNotification();
    showCart(); // aktualisiert den Warenkorb
}

function removeFromCart(itemName) {
    if (cart[itemName]) {
        cart[itemName]--;
        if (cart[itemName] <= 0) {
            delete cart[itemName];
        }
        updateCartCount();
        showCart(); // neu rendern
    }
}

function deleteFromCart(item) {
    delete cart[item];
    updateCartCount();
    showCart(); // neu rendern
}

function showCart() {
    showSection('cart');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = "";

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = "<p>Der Warenkorb ist leer.</p>";
        return;
    }

    const ul = document.createElement("ul");

    Object.entries(cart).forEach(([item, count]) => {
        const li = document.createElement("li");

        const itemLabel = document.createElement("span");
        itemLabel.textContent = `${item}: ${count}`;
        li.appendChild(itemLabel);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.gap = "4px";
        buttonContainer.style.marginLeft = "1rem";

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.addEventListener("click", () => addToCart(item));

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "−";
        minusBtn.addEventListener("click", () => removeFromCart(item));

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.addEventListener("click", () => deleteFromCart(item));

        buttonContainer.appendChild(plusBtn);
        buttonContainer.appendChild(minusBtn);
        buttonContainer.appendChild(delBtn);

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";

        row.appendChild(itemLabel);
        row.appendChild(buttonContainer);

        li.appendChild(row);
        ul.appendChild(li);
    });

    cartItems.appendChild(ul);
}

function submitOrder() {
    console.log("submitOrder aktiv");
    const message = document.getElementById('message').value;
    const email = document.getElementById('email').value;

    fetch('https://partyservice-backend.onrender.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, message, email })
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
