/* script.js
   - Renderiza productos (arreglo)
   - Maneja "Agregar al carrito" (contador + localStorage)
   - Muestra detalle de producto en sección #product-detail
   - Manejo simple de "página" via hash y scroll smooth
*/

/* ------------ Datos (pueden ser estáticos o venir de una API) ------------- */
const products = [
  {
    id: 1,
    title: "Camiseta ecológica",
    price: 19.99,
    img: "https://picsum.photos/id/1011/800/600",
    description: "Camiseta fabricada con algodón orgánico. Cómoda y sostenible."
  },
  {
    id: 2,
    title: "Mochila urbana",
    price: 49.5,
    img: "https://picsum.photos/id/1018/800/600",
    description: "Mochila resistente, ideal para la ciudad y viajes cortos."
  },
  {
    id: 3,
    title: "Botella reutilizable",
    price: 12.0,
    img: "https://picsum.photos/id/1025/800/600",
    description: "Botella de acero inoxidable, mantiene la temperatura por horas."
  },
  {
    id: 4,
    title: "Gorra minimalista",
    price: 14.75,
    img: "https://picsum.photos/id/1005/800/600",
    description: "Gorra cómoda y ligera para el día a día."
  }
];

/* -------------------- STATE: carrito (persistido en localStorage) -------------------- */
const STORAGE_KEY = "mitienda_cart_v1";

// Devuelve un objeto carrito { items: {productId: qty}, count: number }
function loadCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { items: {}, count: 0 };
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { items: {}, count: 0 };
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/* -------------------- RENDER: productos en la grilla -------------------- */
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-3 mb-4";

    col.innerHTML = `
      <article class="card h-100">
        <img src="${product.img}" class="card-img-top product-card-img" alt="${escapeHtml(product.title)}">
        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title">${escapeHtml(product.title)}</h3>
          <p class="mb-2 text-muted small">$${product.price.toFixed(2)}</p>
          <p class="card-text flex-grow-1 small">${escapeHtml(product.description)}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-sm btn-primary add-btn" data-id="${product.id}">Agregar</button>
            <button class="btn btn-sm btn-outline-secondary ver-btn" data-id="${product.id}">Ver más</button>
          </div>
        </div>
      </article>
    `;
    grid.appendChild(col);
  });
}

/* -------------------- RENDER: carrito (simulado) -------------------- */
function renderCartItems() {
  const cart = loadCart();
  const container = document.getElementById("cart-items");
  if (!container) return;
  container.innerHTML = "";

  const ids = Object.keys(cart.items);
  if (ids.length === 0) {
    container.innerHTML = `<p class="text-muted">El carrito está vacío.</p>`;
    return;
  }

  ids.forEach(id => {
    const qty = cart.items[id];
    const prod = products.find(p => p.id === Number(id));
    if (!prod) return;

    const item = document.createElement("div");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(prod.title)}</strong>
        <div class="small text-muted">$${prod.price.toFixed(2)} x ${qty}</div>
      </div>
      <div>
        <span class="badge bg-primary rounded-pill">${qty}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

/* -------------------- ACTUALIZAR contador en navbar -------------------- */
function updateCartCount() {
  const cart = loadCart();
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = cart.count || 0;
}

/* -------------------- FUNCIONES: añadir / quitar -------------------- */
function addToCart(productId, qty = 1) {
  const cart = loadCart();
  cart.items = cart.items || {};
  const idStr = String(productId);
  cart.items[idStr] = (cart.items[idStr] || 0) + qty;
  cart.count = (cart.count || 0) + qty;
  saveCart(cart);
  updateCartCount();
  renderCartItems();
}

/* Vaciar carrito */
function clearCart() {
  const empty = { items: {}, count: 0 };
  saveCart(empty);
  updateCartCount();
  renderCartItems();
}

/* -------------------- DETALLE DE PRODUCTO (mostrar sección) -------------------- */
function showProductDetail(productId) {
  const prod = products.find(p => p.id === Number(productId));
  if (!prod) return;

  // Llenar campos
  document.getElementById("detail-img").src = prod.img;
  document.getElementById("detail-img").alt = prod.title;
  document.getElementById("detail-title").textContent = prod.title;
  document.getElementById("detail-price").textContent = `$${prod.price.toFixed(2)}`;
  document.getElementById("detail-desc").textContent = prod.description;

  // Mostrar sección
  document.getElementById("home").classList.add("visually-hidden");
  document.getElementById("products-grid").parentElement.classList.add("visually-hidden");
  document.getElementById("product-detail").classList.remove("visually-hidden");
  document.getElementById("carrito").classList.add("visually-hidden");
  document.getElementById("contacto").classList.add("visually-hidden");

  // Guardar id en atributo del botón "Agregar" para detalle
  const btn = document.getElementById("detail-add");
  btn.setAttribute("data-id", prod.id);

  // Scroll suave al detalle
  document.getElementById("product-detail").scrollIntoView({ behavior: "smooth" });
}

/* Volver a home */
function showHome() {
  document.getElementById("home").classList.remove("visually-hidden");
  document.getElementById("products-grid").parentElement.classList.remove("visually-hidden");
  document.getElementById("product-detail").classList.add("visually-hidden");
  document.getElementById("carrito").classList.add("visually-hidden");
  document.getElementById("contacto").classList.add("visually-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Mostrar carrito (simulado) */
function showCart() {
  document.getElementById("home").classList.add("visually-hidden");
  document.getElementById("products-grid").parentElement.classList.add("visually-hidden");
  document.getElementById("product-detail").classList.add("visually-hidden");
  document.getElementById("carrito").classList.remove("visually-hidden");
  document.getElementById("contacto").classList.add("visually-hidden");
  document.getElementById("carrito").scrollIntoView({ behavior: "smooth" });
}

/* -------------------- UTIL: escapar HTML simple -------------------- */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* -------------------- EVENT LISTENERS (delegación en grid) -------------------- */
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  updateCartCount();
  renderCartItems();

  // Delegación: clicks dentro del grid de productos
  const grid = document.getElementById("products-grid");
  grid.addEventListener("click", function (e) {
    const addBtn = e.target.closest(".add-btn");
    const verBtn = e.target.closest(".ver-btn");
    if (addBtn) {
      const id = addBtn.getAttribute("data-id");
      addToCart(id);
      return;
    }
    if (verBtn) {
      const id = verBtn.getAttribute("data-id");
      // Navegar a "detalle" (simula página)
      window.location.hash = `product-${id}`;
      showProductDetail(id);
      return;
    }
  });

  // Botón "Agregar" dentro del detalle
  document.getElementById("detail-add").addEventListener("click", function () {
    const id = this.getAttribute("data-id");
    addToCart(id);
  });

  // Botón "Volver" desde detalle
  document.getElementById("detail-back").addEventListener("click", function () {
    showHome();
    window.location.hash = "home";
  });

  // Link carrito en navbar
  document.getElementById("link-carrito").addEventListener("click", function (e) {
    e.preventDefault();
    showCart();
    window.location.hash = "carrito";
  });

  // Link home
  document.getElementById("link-home").addEventListener("click", function (e) {
    e.preventDefault();
    showHome();
    window.location.hash = "home";
  });

  // Clear cart
  document.getElementById("clear-cart").addEventListener("click", function () {
    clearCart();
  });

  // Manejar hash en caso de recarga o navegación directa
  handleInitialHash();
});

/* Maneja hash si el usuario navega directamente a #product-2 etc. */
function handleInitialHash() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;
  if (hash.startsWith("product-")) {
    const id = hash.split("-")[1];
    showProductDetail(id);
  } else if (hash === "carrito") {
    showCart();
  } else {
    showHome();
  }
}

/* -------------------- FIN script.js -------------------- */
