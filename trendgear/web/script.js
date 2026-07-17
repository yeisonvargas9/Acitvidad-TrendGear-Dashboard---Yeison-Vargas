/**
 * TrendGear Dashboard - Fase III: Logica de Programacion e Integracion con Firebase
 *
 * Este script:
 *   1. Hace fetch del dataset (Firebase Realtime Database o data.json local).
 *   2. Renderiza tarjetas de cliente dinamicamente con Template Literals.
 *   3. Calcula KPIs (clientes totales, ingresos, ticket promedio, edad promedio).
 *   4. Permite buscar, filtrar por membresia y ordenar.
 *   5. Controla el menu "hamburguesa" responsivo.
 *
 * -----------------------------------------------------------------------
 * CONEXION A FIREBASE REALTIME DATABASE
 * -----------------------------------------------------------------------
 * Este proyecto no incluye credenciales de un proyecto Firebase real (no
 * se deben publicar claves ni URLs privadas en un entregable de taller).
 * Por defecto, DATA_SOURCE apunta a "data.json", un archivo local con la
 * misma forma que exportaria Firebase Realtime Database (un objeto
 * indexado por Customer ID), para que el dashboard funcione de inmediato
 * sin configuracion adicional.
 *
 * Para conectarlo a tu propio Firebase Realtime Database:
 *   1. Crea un proyecto en https://console.firebase.google.com
 *   2. Habilita Realtime Database y carga el dataset en un nodo, p. ej. "customers".
 *   3. Copia la URL REST de ese nodo, que tiene el formato:
 *        https://TU-PROYECTO-default-rtdb.firebaseio.com/customers.json
 *   4. Reemplaza el valor de DATA_SOURCE mas abajo por esa URL.
 * El resto del codigo (fetch, forEach, renderizado) no necesita cambios,
 * porque ya espera exactamente esa forma de datos.
 */

const DATA_SOURCE = "https://trendgear-dashboard-d96cc-default-rtdb.firebaseio.com/.json";
// Ejemplo de URL real de Firebase (comentada):
// const DATA_SOURCE = "https://trendgear-demo-default-rtdb.firebaseio.com/customers.json";

const state = {
  customers: [],
  search: "",
  membership: "",
  sort: "date-desc",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// ---------------------------------------------------------------------
// 1. Fetch de datos
// ---------------------------------------------------------------------
async function loadCustomers() {
  const statusEl = document.getElementById("status-line");

  try {
    const response = await fetch(DATA_SOURCE);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} al consultar ${DATA_SOURCE}`);
    }

    const raw = await response.json();

    // Firebase Realtime Database entrega un objeto { id: registro, ... }
    // en lugar de un arreglo, asi que lo convertimos con Object.values.
    state.customers = Object.values(raw || {});

    statusEl.textContent = `Conectado - ${state.customers.length} clientes cargados`;
    statusEl.classList.add("ok");

    renderDashboard();
  } catch (error) {
    // Protocolo de depuracion asistida: se registra el error completo en
    // consola para poder copiarlo y pedir ayuda a la IA junto al
    // fragmento de codigo relevante.
    console.error("Error al cargar el dataset de TrendGear:", error);
    statusEl.textContent = "No se pudo cargar el dataset. Revisa la consola.";
    statusEl.classList.add("error");
  }
}

// ---------------------------------------------------------------------
// 2. KPIs
// ---------------------------------------------------------------------
function renderKPIs(customers) {
  const total = customers.length;
  const revenue = customers.reduce((sum, c) => sum + Number(c["Amount Spent (USD)"]), 0);
  const avgTicket = total ? revenue / total : 0;
  const avgAge = total
    ? customers.reduce((sum, c) => sum + Number(c["Age"]), 0) / total
    : 0;

  document.getElementById("kpi-total").textContent = total.toString();
  document.getElementById("kpi-revenue").textContent = currencyFormatter.format(revenue);
  document.getElementById("kpi-avg").textContent = currencyFormatter.format(avgTicket);
  document.getElementById("kpi-age").textContent = `${avgAge.toFixed(1)} anios`;
}

// ---------------------------------------------------------------------
// 3. Filtrado, busqueda y orden
// ---------------------------------------------------------------------
function getFilteredCustomers() {
  const term = state.search.trim().toLowerCase();

  let filtered = state.customers.filter((c) => {
    const matchesSearch =
      !term ||
      c["Name"].toLowerCase().includes(term) ||
      c["City"].toLowerCase().includes(term) ||
      c["Product Purchased"].toLowerCase().includes(term);

    const matchesMembership =
      !state.membership || c["Membership Status"] === state.membership;

    return matchesSearch && matchesMembership;
  });

  filtered = filtered.sort((a, b) => {
    switch (state.sort) {
      case "date-asc":
        return new Date(a["Purchase Date"]) - new Date(b["Purchase Date"]);
      case "amount-desc":
        return Number(b["Amount Spent (USD)"]) - Number(a["Amount Spent (USD)"]);
      case "amount-asc":
        return Number(a["Amount Spent (USD)"]) - Number(b["Amount Spent (USD)"]);
      case "date-desc":
      default:
        return new Date(b["Purchase Date"]) - new Date(a["Purchase Date"]);
    }
  });

  return filtered;
}

// ---------------------------------------------------------------------
// 4. Renderizado dinamico de tarjetas (Template Literals + forEach)
// ---------------------------------------------------------------------
function badgeClass(membership) {
  return `badge-${String(membership).toLowerCase()}`;
}

function renderCustomerCards(customers) {
  const grid = document.getElementById("card-grid");
  const countEl = document.getElementById("result-count");

  countEl.textContent = `${customers.length} cliente(s) encontrados`;

  if (customers.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay clientes que coincidan con la busqueda o el filtro.</div>`;
    return;
  }

  let html = "";

  customers.forEach((c) => {
    const amount = Number(c["Amount Spent (USD)"]);

    html += `
      <article class="customer-card">
        <div class="card-top">
          <div>
            <div class="card-name">${c["Name"]}</div>
            <div class="card-id">${c["Customer ID"]}</div>
          </div>
          <span class="badge ${badgeClass(c["Membership Status"])}">${c["Membership Status"]}</span>
        </div>

        <div class="card-detail"><span>Producto</span><strong>${c["Product Purchased"]}</strong></div>
        <div class="card-detail"><span>Ciudad</span><strong>${c["City"]}</strong></div>
        <div class="card-detail"><span>Pago</span><strong>${c["Payment Method"]}</strong></div>
        <div class="card-detail"><span>Compra</span><strong>${c["Purchase Date"]}</strong></div>
        <div class="card-detail"><span>Ultimo acceso</span><strong>${c["Last Login Date"]}</strong></div>

        <div class="card-amount">${currencyFormatter.format(amount)}</div>
      </article>
    `;
  });

  grid.innerHTML = html;
}

function renderDashboard() {
  const filtered = getFilteredCustomers();
  renderKPIs(state.customers); // KPIs siempre reflejan el dataset completo
  renderCustomerCards(filtered);
}

// ---------------------------------------------------------------------
// 5. Controles: busqueda, filtro, orden
// ---------------------------------------------------------------------
function bindControls() {
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderDashboard();
  });

  document.getElementById("filter-membership").addEventListener("change", (e) => {
    state.membership = e.target.value;
    renderDashboard();
  });

  document.getElementById("sort-select").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderDashboard();
  });
}

// ---------------------------------------------------------------------
// 6. Menu hamburguesa responsivo
// ---------------------------------------------------------------------
function bindHamburger() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("main-nav");

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------------------------------------------------------------------
// Inicializacion
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  bindControls();
  bindHamburger();
  loadCustomers();
});
