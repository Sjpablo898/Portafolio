const products = [
  { id: 1, name: "Charizard EX", price: 15000, image: "assets/img/charizard.jpg" },
  { id: 2, name: "Pikachu VMAX", price: 12000, image: "assets/img/pikachu.jpg" },
  { id: 3, name: "Mewtwo GX", price: 18000, image: "assets/img/mewtwo.jpg" },
  { id: 4, name: "Gengar Holo", price: 10000, image: "assets/img/gengar.jpg" },
  { id: 5, name: "Lucario VSTAR", price: 16000, image: "assets/img/lucario.jpg" }
];

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = products.map(p => `
    <div class="col-md-4 col-lg-3 mb-4">
      <div class="card h-100 text-center">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text text-warning">$${p.price}</p>
          <button class="btn btn-warning add-to-cart" data-id="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </div>`).join("");
}

function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  let total = 0;

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalContainer.textContent = "";
  } else {
    container.innerHTML = cartItems.map(item => `
      <div class="d-flex justify-content-between border-bottom py-2">
        <span>${item.name}</span>
        <span>$${item.price}</span>
      </div>`).join("");
    total = cartItems.reduce((acc, item) => acc + item.price, 0);
    totalContainer.textContent = "Total: $" + total;
  }
  updateCheckoutButton();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

function updateCheckoutButton() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  checkoutBtn.disabled = cartItems.length === 0;
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartItems.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  alert("✅ ¡Compra realizada con éxito! Gracias por tu pedido.");
  localStorage.removeItem("cart");
  renderCart();
  updateCheckoutButton();
});

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
});
