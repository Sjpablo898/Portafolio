// PRODUCTS LIST
const PRODUCTS = [
  { id:1, name:'Pikachu V', set:'Base', rarity:'Holo', price:4990, stock:5, img:'assets/img/Pikachu.png', desc:'Pikachu V — carta electrizante para tu colección.'},
  { id:2, name:'Charizard GX', set:'Fire Legends', rarity:'Secret', price:25000, stock:2, img:'assets/img/Charizard.jpg', desc:'Charizard GX — edición limitada, alto valor.'},
  { id:3, name:'Mewtwo EX', set:'Psycho King', rarity:'Holo', price:20000, stock:3, img:'assets/img/Mewtwo.png', desc:'Mewtwo EX — poder psíquico supremo.'},
  { id:4, name:'Gengar VMAX', set:'Spooky', rarity:'Ultra', price:22000, stock:4, img:'assets/img/Gengar.png', desc:'Gengar VMAX — arte inquietante y fuerte.'},
  { id:5, name:'Lucario VSTAR', set:'Fighting', rarity:'Rare', price:18000, stock:6, img:'assets/img/Lucario.jpg', desc:'Lucario VSTAR — velocidad y fuerza.'}
];

// UTIL
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // set year
  ['#year','#year2','#year3'].forEach(id => { const el = document.querySelector(id); if(el) el.textContent = new Date().getFullYear(); });
  renderProducts();
  attachSearchFilter();
  renderDetailIfNeeded();
  renderCartIfNeeded();
  updateCartCount();
});

// RENDER PRODUCTS
function renderProducts(list = PRODUCTS){
  const row = $('#productsRow'); if(!row) return;
  row.innerHTML = '';
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.img}" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${p.name}</h5>
            <small class="badge bg-dark text-white">${p.rarity}</small>
          </div>
          <p class="text-muted small mb-2">${p.set}</p>
          <p class="card-text text-muted mb-3">${truncate(p.desc,90)}</p>
          <div class="d-flex align-items-center justify-content-between mt-auto">
            <div class="price-tag">$${p.price.toLocaleString()}</div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-light" onclick="viewProduct(${p.id})">Ver</button>
              <button class="btn btn-sm btn-ptcg" onclick="addToCart(${p.id})"><i class="bi bi-cart-plus"></i> Agregar</button>
            </div>
          </div>
        </div>
      </div>`;
    row.appendChild(col);
  });
}

// SEARCH & FILTER
function attachSearchFilter(){
  const input = $('#searchInput'); if(!input) return;
  input.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.set.toLowerCase().includes(q));
    renderProducts(filtered);
  });
}

// NAVIGATE TO DETAIL
function viewProduct(id){
  window.location.href = `producto.html?id=${id}`;
}

// DETAIL PAGE
function renderDetailIfNeeded(){
  const container = $('#detailContainer'); if(!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || PRODUCTS[0].id;
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) { container.innerHTML = '<div class="text-muted">Carta no encontrada</div>'; return; }
  container.innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-md-5 text-center">
        <img src="${p.img}" class="img-fluid rounded shadow-strong" style="max-height:420px;">
      </div>
      <div class="col-md-7">
        <h2 class="brand-title">${p.name}</h2>
        <p class="text-muted small mb-1">${p.set} • <span class="badge bg-secondary">${p.rarity}</span></p>
        <p class="mt-3 mb-3">${p.desc}</p>
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="h3 mb-0">$${p.price.toLocaleString()}</div>
          <div class="text-muted small">Stock: ${p.stock}</div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-ptcg" onclick="addToCart(${p.id})">Agregar al carrito</button>
          <a href="carrito.html" class="btn btn-outline-light">Ir al carrito</a>
        </div>
      </div>
    </div>
  `;
}

// CART OPERATIONS
function getCart(){ return JSON.parse(localStorage.getItem('tcg_cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('tcg_cart', JSON.stringify(cart)); }

function addToCart(id){
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) return alert('Producto no encontrado');
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if(existing){
    if(existing.qty < prod.stock) existing.qty++;
    else return alert('No hay más stock disponible.');
  } else {
    cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty:1, stock: prod.stock });
  }
  saveCart(cart);
  updateCartCount();
  renderCartIfNeeded();
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCartIfNeeded();
}

function changeQty(id, delta){
  const prod = PRODUCTS.find(p => p.id === id);
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty = Math.max(1, Math.min(item.stock, item.qty + delta));
  saveCart(cart);
  updateCartCount();
  renderCartIfNeeded();
}

function emptyCart(){
  localStorage.removeItem('tcg_cart');
  updateCartCount();
  renderCartIfNeeded();
}

// RENDER CART (carrito.html)
function renderCartIfNeeded(){
  const cartDiv = $('#cartList');
  if(!cartDiv) return;
  const cart = getCart();
  cartDiv.innerHTML = '';
  if(cart.length === 0){
    cartDiv.innerHTML = '<div class="text-muted">Tu carrito está vacío. <a href="index.html">Ver cartas</a></div>';
    document.getElementById('cartSubtotal').textContent = '$0';
    return;
  }
  cart.forEach(it => {
    const row = document.createElement('div');
    row.className = 'd-flex align-items-center gap-3 bg-card p-3 mb-3';
    row.innerHTML = `
      <img src="${it.img}" class="cart-item-img" alt="${it.name}" style="width:84px;height:84px;object-fit:cover;border-radius:8px;">
      <div class="flex-grow-1">
        <h6 class="mb-1">${it.name}</h6>
        <div class="small text-muted">Precio unitario: $${it.price.toLocaleString()}</div>
        <div class="mt-2 d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-light" onclick="changeQty(${it.id}, -1)">-</button>
          <button class="btn btn-dark disabled">${it.qty}</button>
          <button class="btn btn-sm btn-outline-light" onclick="changeQty(${it.id}, 1)">+</button>
          <button class="btn btn-sm btn-link text-danger ms-3" onclick="removeFromCart(${it.id})">Eliminar</button>
        </div>
      </div>
      <div class="text-end">
        <div class="font-bold">$${(it.price * it.qty).toLocaleString()}</div>
      </div>
    `;
    cartDiv.appendChild(row);
  });
  const subtotal = cart.reduce((s,i)=> s + i.qty * i.price, 0);
  document.getElementById('cartSubtotal').textContent = '$' + subtotal.toLocaleString();
}

// CHECKOUT BUTTON
function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=> s + i.qty, 0);
  const el = document.getElementById('cart-count');
  const el2 = document.getElementById('cart-count-detail');
  if(el) el.textContent = count;
  if(el2) el2.textContent = count;
}

document.addEventListener('click', (e) => {
  if(e.target && e.target.id === 'checkoutBtn' || e.target && e.target.id === 'checkout-btn') {
    // This covers multiple possible IDs if used elsewhere
    const cart = getCart();
    if(cart.length === 0){ alert('Tu carrito está vacío.'); return; }
    if(confirm('¿Confirmar compra?')) {
      alert('✅ Compra realizada. ¡Gracias!');
      emptyCart();
    }
  }
});

// attach buttons on carrito page
document.addEventListener('DOMContentLoaded', () => {
  const emptyBtn = document.getElementById('emptyCartBtn');
  if(emptyBtn) emptyBtn.addEventListener('click', () => {
    if(confirm('Vaciar carrito?')) emptyCart();
  });
  const checkout = document.getElementById('checkoutBtn');
  if(checkout) checkout.addEventListener('click', () => {
    const cart = getCart();
    if(cart.length === 0) { alert('Tu carrito está vacío.'); return; }
    if(confirm('¿Confirmar compra?')) {
      alert('✅ Compra realizada. ¡Gracias!');
      emptyCart();
    }
  });
}); 

// UTIL
function truncate(str,n){ return str.length>n? str.slice(0,n-1)+'…':str; }
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
