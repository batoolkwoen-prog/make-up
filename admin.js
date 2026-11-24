/* ============================================================
   MAISON VÉLOUR — 2027 COUTURE ADMIN WORKFLOW & CHARTS ENGINE
   Connected to Supabase Project: wjchyhnoafkbyosfffqh
   ============================================================ */

// 1. SUPABASE CLIENT INITIALIZATION
const SUPABASE_URL = "https://wjchyhnoafkbyosfffqh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqY2h5aG5vYWZrYnlvc2ZmZnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1NTY1NTEsImV4cCI6MjExMTEzMjU1MX0.l7ZA3A2cZj3Pzd4TLLtMc3K2uNCyQYRkVDochJGIO6o";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Application State
const state = {
  currentView: "orders",
  viewMode: "kanban", // 'kanban' or 'table'
  statusFilter: "all",
  searchQuery: "",
  orders: [],
  products: [],
  charts: {},
  realtimeChannel: null
};

// Workflow Status Progression Order
const WORKFLOW_STAGES = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STAGE_LABELS = {
  pending: "1. Detected / Pending",
  confirmed: "2. Confirmed",
  processing: "3. Atelier Prep",
  shipped: "4. In Transit",
  delivered: "5. Delivered"
};

// ============================================================
// BOOTSTRAP & INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  initNavigation();
  initSearch();
  initDragAndDrop();
  initSimulateButton();
  
  await fetchInitialData();
  initRealtimeRadar();
  initCharts();
});

// ============================================================
// DATA FETCHING (SUPABASE + FALLBACK)
// ============================================================
async function fetchInitialData() {
  showToast("Synchronizing with Supabase remote...");
  
  if (supabase) {
    try {
      // 1. Fetch Orders with Items
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (ordersErr) throw ordersErr;
      state.orders = ordersData || [];

      // 2. Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from("products")
        .select(`
          *,
          product_shades (*)
        `);

      if (prodErr) throw prodErr;
      state.products = prodData || [];

      document.getElementById("connStatusPill").title = "Remote Supabase Postgres Connected";
    } catch (err) {
      console.warn("Supabase fetch notice, using cached/seeded state:", err);
      loadMockSeedData();
    }
  } else {
    loadMockSeedData();
  }

  renderAllViews();
}

function loadMockSeedData() {
  state.orders = [
    {
      id: "f1a23b45-67c8-49de-8012-34567890abcd",
      shipping_name: "Clara Delacroix",
      shipping_email: "clara.delacroix@vogue.fr",
      shipping_address: "18 Rue de la Paix, 75002 Paris, France",
      status: "pending",
      subtotal: 130.00,
      discount: 19.50,
      total: 110.50,
      promo_code: "VELOUR27",
      created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      order_items: [
        { product_id: "velour-lip-sculpt", shade_name: "01 Crimson Atelier", shade_hex: "#9E2438", qty: 1, unit_price: 48.00 },
        { product_id: "chroma-eye-palette", shade_name: "Nocturne Rose", shade_hex: "#8B3E4D", qty: 1, unit_price: 82.00 }
      ]
    },
    {
      id: "a9b8c7d6-e5f4-4321-ba09-876543210fed",
      shipping_name: "Minji Kim",
      shipping_email: "minji.kim@atelier-seoul.kr",
      shipping_address: "Hannam The Hill, Yongsan-gu, Seoul, Korea",
      status: "confirmed",
      subtotal: 196.00,
      discount: 0.00,
      total: 196.00,
      promo_code: null,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      order_items: [
        { product_id: "lumiere-serum-tint", shade_name: "230 Warm Sand", shade_hex: "#D6A888", qty: 2, unit_price: 68.00 },
        { product_id: "petal-dew-blush", shade_name: "Velvet Peony", shade_hex: "#D56C7D", qty: 1, unit_price: 44.00 }
      ]
    },
    {
      id: "e3d2c1b0-f9a8-4765-8123-456789abcdef",
      shipping_name: "Elena Rostova",
      shipping_email: "elena.rostova@harpers.com",
      shipping_address: "432 Park Ave, Apt 58B, New York, NY 10022",
      status: "processing",
      subtotal: 204.00,
      discount: 30.60,
      total: 173.40,
      promo_code: "VELOUR27",
      carrier: "DHL Express",
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      order_items: [
        { product_id: "lumiere-serum-tint", shade_name: "110 Alabaster", shade_hex: "#F2DCCB", qty: 1, unit_price: 68.00 },
        { product_id: "chroma-eye-palette", shade_name: "Molten Bronze", shade_hex: "#9C6E4E", qty: 1, unit_price: 82.00 },
        { product_id: "aether-pearl-highlighter", shade_name: "Champagne Halo", shade_hex: "#E5C8A8", qty: 1, unit_price: 54.00 }
      ]
    },
    {
      id: "11223344-5566-4778-8990-aabbccddeeff",
      shipping_name: "Camille Bernard",
      shipping_email: "camille.bernard@lux.ch",
      shipping_address: "Quai du Mont-Blanc 12, Geneva, Switzerland",
      status: "shipped",
      subtotal: 92.00,
      discount: 0.00,
      total: 92.00,
      tracking_number: "MV-DHL-984210",
      carrier: "DHL Express",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      order_items: [
        { product_id: "velour-lip-sculpt", shade_name: "04 Rosewood Noir", shade_hex: "#7A3E48", qty: 1, unit_price: 48.00 },
        { product_id: "petal-dew-blush", shade_name: "Sunlit Fig", shade_hex: "#A64B58", qty: 1, unit_price: 44.00 }
      ]
    },
    {
      id: "99887766-5544-4332-2110-ffeeddccbbaa",
      shipping_name: "Sophia Vanderbilt",
      shipping_email: "sophia.vanderbilt@london.co.uk",
      shipping_address: "14 Kensington Palace Gardens, London, UK",
      status: "delivered",
      subtotal: 274.00,
      discount: 41.10,
      total: 232.90,
      promo_code: "VELOUR27",
      tracking_number: "MV-FEDEX-44129",
      carrier: "FedEx Couture Priority",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      order_items: [
        { product_id: "velour-lip-sculpt", shade_name: "01 Crimson Atelier", shade_hex: "#9E2438", qty: 2, unit_price: 48.00 },
        { product_id: "lumiere-serum-tint", shade_name: "230 Warm Sand", shade_hex: "#D6A888", qty: 1, unit_price: 68.00 },
        { product_id: "chroma-eye-palette", shade_name: "Molten Bronze", shade_hex: "#9C6E4E", qty: 1, unit_price: 82.00 }
      ]
    }
  ];
}

// ============================================================
// REALTIME SUPABASE WEBSOCKET RADAR
// ============================================================
function initRealtimeRadar() {
  if (!supabase) return;

  state.realtimeChannel = supabase
    .channel("public:orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      async (payload) => {
        const { eventType, new: newRec, old: oldRec } = payload;
        
        if (eventType === "INSERT") {
          // Fetch complete items for the new order
          const { data: itemRows } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", newRec.id);
          
          newRec.order_items = itemRows || [];
          state.orders.unshift(newRec);
          showToast(`⚡ NEW ORDER DETECTED: #${newRec.id.slice(0, 8)} (${newRec.shipping_name})`);
          triggerRadarPulse();
        } else if (eventType === "UPDATE") {
          const idx = state.orders.findIndex(o => o.id === newRec.id);
          if (idx !== -1) {
            newRec.order_items = state.orders[idx].order_items; // retain items
            state.orders[idx] = newRec;
            showToast(`Workflow step updated: #${newRec.id.slice(0, 8)} → ${newRec.status.toUpperCase()}`);
          }
        } else if (eventType === "DELETE") {
          state.orders = state.orders.filter(o => o.id === oldRec.id);
        }

        renderAllViews();
        updateCharts();
      }
    )
    .subscribe();
}

function triggerRadarPulse() {
  const chip = document.getElementById("detectorChip");
  chip.style.borderColor = "var(--accent-champagne)";
  chip.style.backgroundColor = "rgba(230, 209, 177, 0.25)";
  setTimeout(() => {
    chip.style.borderColor = "";
    chip.style.backgroundColor = "";
  }, 1200);
}

// ============================================================
// RENDERING & PIPELINE CONTROLS
// ============================================================
function renderAllViews() {
  updateKPIs();
  renderWorkflowBoard();
  renderTableView();
  renderInventoryView();
  document.getElementById("lastSyncTime").textContent = `SYNCED: ${new Date().toLocaleTimeString()}`;
}

function updateKPIs() {
  const totalRevenue = state.orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const activeCount = state.orders.filter(o => ["pending", "confirmed", "processing"].includes(o.status)).length;
  const pendingCount = state.orders.filter(o => o.status === "pending").length;
  const procCount = state.orders.filter(o => o.status === "processing").length;
  const totalDiscounts = state.orders.reduce((sum, o) => sum + Number(o.discount || 0), 0);

  document.getElementById("kpiRevenue").textContent = `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("kpiActiveOrders").textContent = activeCount;
  document.getElementById("kpiActiveBreakdown").textContent = `${pendingCount} Pending · ${procCount} Atelier Prep`;
  document.getElementById("kpiDiscountVolume").textContent = `$${totalDiscounts.toFixed(2)}`;

  document.getElementById("sidebarOrderCount").textContent = state.orders.length;
}

// Filtered Orders Helper
function getFilteredOrders() {
  let list = [...state.orders];

  if (state.statusFilter !== "all") {
    list = list.filter(o => o.status === state.statusFilter);
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(o => 
      o.id.toLowerCase().includes(q) ||
      (o.shipping_name && o.shipping_name.toLowerCase().includes(q)) ||
      (o.shipping_email && o.shipping_email.toLowerCase().includes(q)) ||
      (o.shipping_address && o.shipping_address.toLowerCase().includes(q)) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(q))
    );
  }

  return list;
}

// Render Kanban Workflow Board
function renderWorkflowBoard() {
  const counts = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0 };
  WORKFLOW_STAGES.forEach(st => {
    counts[st] = state.orders.filter(o => o.status === st).length;
    const countEl = document.getElementById(`count${capitalize(st)}`);
    const colCountEl = document.getElementById(`colCount${capitalize(st)}`);
    if (countEl) countEl.textContent = counts[st];
    if (colCountEl) colCountEl.textContent = counts[st];
  });
  document.getElementById("countAll").textContent = state.orders.length;

  const filtered = getFilteredOrders();

  WORKFLOW_STAGES.forEach(stage => {
    const colWrap = document.getElementById(`colCards${capitalize(stage)}`);
    if (!colWrap) return;

    const stageOrders = filtered.filter(o => o.status === stage);

    if (stageOrders.length === 0) {
      colWrap.innerHTML = `
        <div style="text-align:center;padding:32px 12px;color:var(--ink-faint);font-size:0.75rem;font-family:var(--font-mono);">
          NO ORDERS IN STAGE
        </div>
      `;
      return;
    }

    colWrap.innerHTML = stageOrders.map(order => createOrderCardHTML(order)).join("");
  });

  attachCardEvents();
}

function createOrderCardHTML(order) {
  const shortId = order.id.slice(0, 8);
  const timeAgo = formatTimeAgo(order.created_at);
  const items = order.order_items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.qty || 1), 0);
  const isRecent = (Date.now() - new Date(order.created_at).getTime()) < 1000 * 60 * 30; // 30m

  return `
    <div class="order-wf-card ${isRecent && order.status === 'pending' ? 'is-new-detected' : ''}" 
         draggable="true" 
         data-order-id="${order.id}" 
         data-status="${order.status}">
      <div class="order-card-top">
        <span class="order-ref">#${shortId}</span>
        <span class="order-time">${timeAgo}</span>
      </div>

      <div class="order-client-name">${escapeHTML(order.shipping_name || "Private Client")}</div>
      <div class="order-destination">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>${escapeHTML(order.shipping_address ? order.shipping_address.split(",").slice(-2).join(",").trim() : "Atelier Vault")}</span>
      </div>

      <div class="order-items-snippet">
        ${items.slice(0, 2).map(item => `
          <div class="order-item-row">
            <span>${item.qty}x ${escapeHTML(item.product_id.replace(/-/g, ' '))}</span>
            ${item.shade_name ? `
              <span class="order-item-shade-tag">
                <i style="background:${item.shade_hex || '#9E2438'};"></i>
                ${escapeHTML(item.shade_name.split(' ').slice(0, 2).join(' '))}
              </span>
            ` : ''}
          </div>
        `).join("")}
        ${items.length > 2 ? `<div style="font-size:0.68rem;color:var(--ink-faint);margin-top:2px;">+${items.length - 2} more couture items</div>` : ''}
      </div>

      <div class="order-card-footer">
        <div class="order-card-total">$${Number(order.total).toFixed(2)}</div>
        <div class="order-card-step-actions">
          ${getStepActionButtonsHTML(order)}
        </div>
      </div>
    </div>
  `;
}

function getStepActionButtonsHTML(order) {
  const currentIdx = WORKFLOW_STAGES.indexOf(order.status);
  let html = `<button class="step-btn btn-inspect" data-inspect-id="${order.id}" title="Inspect full order dossier">Inspect</button>`;

  if (currentIdx > 0) {
    const prevStage = WORKFLOW_STAGES[currentIdx - 1];
    html += `<button class="step-btn" data-move-id="${order.id}" data-target-status="${prevStage}" title="Rollback to ${STAGE_LABELS[prevStage]}">←</button>`;
  }

  if (currentIdx < WORKFLOW_STAGES.length - 1) {
    const nextStage = WORKFLOW_STAGES[currentIdx + 1];
    html += `<button class="step-btn step-next" data-move-id="${order.id}" data-target-status="${nextStage}" title="Advance to ${STAGE_LABELS[nextStage]}">Advance →</button>`;
  }

  return html;
}

// Render Table View
function renderTableView() {
  const tbody = document.getElementById("ordersTableBody");
  const filtered = getFilteredOrders();

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--ink-muted);">No orders matching query</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const items = o.order_items || [];
    return `
      <tr>
        <td>
          <strong class="mono-tag" style="color:var(--accent-champagne);">#${o.id.slice(0, 8)}</strong>
          <div style="font-size:0.75rem;color:var(--ink-faint);">${formatTimeAgo(o.created_at)}</div>
        </td>
        <td>
          <div><strong>${escapeHTML(o.shipping_name || "Private Client")}</strong></div>
          <div style="font-size:0.78rem;color:var(--ink-muted);">${escapeHTML(o.shipping_email || "")}</div>
          <div style="font-size:0.75rem;color:var(--ink-faint);">${escapeHTML(o.shipping_address || "")}</div>
        </td>
        <td>
          <div style="font-size:0.8rem;">
            ${items.map(i => `${i.qty}x ${escapeHTML(i.product_id)} (${escapeHTML(i.shade_name || "Studio")})`).join("<br>")}
          </div>
        </td>
        <td>
          <span class="status-badge ${o.status}">${o.status}</span>
        </td>
        <td>
          <strong class="mono-tag" style="font-size:0.95rem;">$${Number(o.total).toFixed(2)}</strong>
          ${o.promo_code ? `<div style="font-size:0.7rem;color:var(--accent-gold);">${o.promo_code}</div>` : ''}
        </td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="step-btn btn-inspect" data-inspect-id="${o.id}">Inspect</button>
            ${getStepActionButtonsHTML(o)}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Render Inventory View
function renderInventoryView() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid || !state.products.length) return;

  grid.innerHTML = state.products.map(p => {
    const shades = p.product_shades || [];
    return `
      <div class="inv-card">
        <img src="${p.image || 'assets/product-lipstick.jpg'}" alt="${escapeHTML(p.name)}" />
        <div style="flex:1;">
          <span class="mono-tag">${p.category} · ${p.badge || 'Atelier'}</span>
          <h4 style="font-family:var(--font-serif);font-size:1.25rem;margin:2px 0 4px;">${escapeHTML(p.name)}</h4>
          <div style="font-family:var(--font-mono);color:var(--accent-champagne);font-size:0.9rem;">$${Number(p.price).toFixed(2)}</div>
          <div style="display:flex;gap:6px;margin-top:8px;">
            ${shades.map(s => `<span title="${escapeHTML(s.name)}" style="width:12px;height:12px;border-radius:50%;background:${s.hex};display:inline-block;border:1px solid rgba(255,255,255,0.2);"></span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================================
// WORKFLOW STATE TRANSITIONS (SUPABASE REALTIME PUSH)
// ============================================================
async function moveOrderWorkflow(orderId, newStatus) {
  if (!WORKFLOW_STAGES.includes(newStatus)) return;

  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const oldStatus = order.status;
  order.status = newStatus;
  order.updated_at = new Date().toISOString();

  // If moved to shipped, assign a couture tracking number if absent
  if (newStatus === "shipped" && !order.tracking_number) {
    order.tracking_number = `MV-DHL-${Math.floor(100000 + Math.random() * 900000)}`;
    order.carrier = "DHL Express";
  }

  renderAllViews();
  updateCharts();

  showToast(`Moved #${orderId.slice(0, 8)}: ${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}`);

  // Persist to Supabase
  if (supabase) {
    try {
      const updatePayload = { 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        tracking_number: order.tracking_number,
        carrier: order.carrier
      };

      const { error } = await supabase
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);

      if (error) throw error;
    } catch (err) {
      console.error("Supabase update error:", err);
      showToast(`Warning: Local updated, cloud sync had note: ${err.message}`);
    }
  }
}

// ============================================================
// DRAG & DROP FOR WORKFLOW KANBAN
// ============================================================
function initDragAndDrop() {
  document.querySelectorAll(".wf-column").forEach(column => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      column.classList.remove("drag-over");
      const orderId = e.dataTransfer.getData("text/plain");
      const targetStatus = column.dataset.colStatus;
      if (orderId && targetStatus) {
        moveOrderWorkflow(orderId, targetStatus);
      }
    });
  });
}

function attachCardEvents() {
  document.querySelectorAll(".order-wf-card").forEach(card => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.orderId);
      card.style.opacity = "0.5";
    });

    card.addEventListener("dragend", () => {
      card.style.opacity = "1";
    });
  });

  document.querySelectorAll("[data-move-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      moveOrderWorkflow(btn.dataset.moveId, btn.dataset.targetStatus);
    });
  });

  document.querySelectorAll(".btn-inspect, [data-inspect-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openOrderInspector(btn.dataset.inspectId);
    });
  });
}

// ============================================================
// ORDER INSPECTOR MODAL
// ============================================================
function openOrderInspector(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const content = document.getElementById("orderModalContent");
  const items = order.order_items || [];
  const currentIdx = WORKFLOW_STAGES.indexOf(order.status);

  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
      <div>
        <span class="mono-tag">ATELIER ORDER DOSSIER</span>
        <h2 style="font-family:var(--font-serif);font-size:2rem;font-weight:400;margin:4px 0;">Order #${order.id.slice(0, 8)}</h2>
        <div style="font-size:0.8rem;color:var(--ink-muted);">Received: ${new Date(order.created_at).toLocaleString()}</div>
      </div>
      <span class="status-badge ${order.status}">${order.status}</span>
    </div>

    <!-- Interactive Stage Stepper inside Modal -->
    <div class="modal-stepper">
      ${WORKFLOW_STAGES.map((st, idx) => {
        let cls = "";
        if (st === order.status) cls = "is-current";
        else if (idx < currentIdx) cls = "is-completed";
        return `
          <button class="modal-stepper-btn ${cls}" data-modal-set-status="${st}">
            ${idx + 1}. ${st.toUpperCase()}
          </button>
        `;
      }).join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
      <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
        <span class="mono-tag">CLIENT &amp; SHIPPING</span>
        <div style="font-weight:600;font-size:1rem;margin:6px 0 2px;">${escapeHTML(order.shipping_name || "Private Client")}</div>
        <div style="font-size:0.85rem;color:var(--ink-muted);">${escapeHTML(order.shipping_email || "N/A")}</div>
        <div style="font-size:0.82rem;color:var(--ink-faint);margin-top:6px;">${escapeHTML(order.shipping_address || "Atelier Pickup")}</div>
      </div>

      <div style="background:rgba(255,255,255,0.03);padding:14px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
        <span class="mono-tag">FULFILLMENT DISPATCH</span>
        <div style="margin-top:6px;font-size:0.88rem;">
          <div><strong>Courier:</strong> ${order.carrier || 'Pending Assignment'}</div>
          <div><strong>Tracking:</strong> <span class="mono-tag" style="color:var(--accent-champagne);">${order.tracking_number || 'Awaiting Shipment'}</span></div>
          <div><strong>Privilege Promo:</strong> ${order.promo_code || 'Standard Couture'}</div>
        </div>
      </div>
    </div>

    <span class="mono-tag">CURATED FORMULATIONS (${items.length})</span>
    <div style="margin:10px 0 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;font-size:0.84rem;">
        <thead style="background:rgba(255,255,255,0.03);">
          <tr>
            <th style="padding:10px;text-align:left;">Item Formulation</th>
            <th style="padding:10px;text-align:left;">Shade Matrix</th>
            <th style="padding:10px;text-align:center;">Qty</th>
            <th style="padding:10px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr style="border-top:1px solid rgba(255,255,255,0.04);">
              <td style="padding:10px;">${escapeHTML(it.product_id.replace(/-/g, ' '))}</td>
              <td style="padding:10px;">
                <span class="order-item-shade-tag">
                  <i style="background:${it.shade_hex || '#9E2438'};"></i>
                  ${escapeHTML(it.shade_name || "Default Shade")}
                </span>
              </td>
              <td style="padding:10px;text-align:center;">${it.qty}</td>
              <td style="padding:10px;text-align:right;font-family:var(--font-mono);">$${(it.qty * it.unit_price).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:18px;font-size:0.9rem;border-top:1px solid var(--border-subtle);padding-top:12px;">
      <div>Subtotal: <strong>$${Number(order.subtotal).toFixed(2)}</strong></div>
      ${order.discount > 0 ? `<div style="color:var(--accent-champagne);">Privilege 15%: <strong>-$${Number(order.discount).toFixed(2)}</strong></div>` : ''}
      <div style="font-size:1.1rem;color:var(--accent-gold);">Total: <strong class="mono-tag">$${Number(order.total).toFixed(2)}</strong></div>
    </div>
  `;

  content.querySelectorAll("[data-modal-set-status]").forEach(btn => {
    btn.addEventListener("click", () => {
      moveOrderWorkflow(order.id, btn.dataset.modalSetStatus);
      openOrderInspector(order.id); // refresh modal view
    });
  });

  const modal = document.getElementById("orderModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

// Close Modal
document.getElementById("btnCloseOrderModal").addEventListener("click", () => {
  const modal = document.getElementById("orderModal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
});

// ============================================================
// HIGH-END GLASSMORPHIC CHARTS (CHART.JS)
// ============================================================
function initCharts() {
  Chart.defaults.color = "rgba(246, 241, 235, 0.6)";
  Chart.defaults.font.family = "'Instrument Sans', sans-serif";

  // 1. Revenue Dynamics Chart
  const revCtx = document.getElementById("revenueChart")?.getContext("2d");
  if (revCtx) {
    const gradient = revCtx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(184, 50, 70, 0.35)");
    gradient.addColorStop(1, "rgba(184, 50, 70, 0.0)");

    state.charts.revenue = new Chart(revCtx, {
      type: "line",
      data: {
        labels: ["Day -6", "Day -5", "Day -4", "Day -3", "Day -2", "Yesterday", "Today"],
        datasets: [
          {
            label: "Gross Revenue ($)",
            data: [420, 680, 540, 890, 720, 1140, 1380],
            borderColor: "#b83246",
            backgroundColor: gradient,
            fill: true,
            tension: 0.38,
            borderWidth: 2,
            pointBackgroundColor: "#e6d1b1",
            pointRadius: 4,
            yAxisID: "y"
          },
          {
            label: "Order Volume",
            data: [3, 5, 4, 7, 6, 9, 11],
            borderColor: "#e6d1b1",
            borderDash: [5, 5],
            tension: 0.38,
            borderWidth: 1.5,
            pointRadius: 3,
            yAxisID: "y1"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.05)" } },
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { callback: v => `$${v}` } },
          y1: { position: "right", grid: { display: false } }
        }
      }
    });
  }

  // 2. Category Share Donut
  const catCtx = document.getElementById("categoryDonutChart")?.getContext("2d");
  if (catCtx) {
    state.charts.category = new Chart(catCtx, {
      type: "doughnut",
      data: {
        labels: ["Lips (Velour Sculpt)", "Complexion (Lumière)", "Eyes (Chroma-6)", "Cheek (Petal Dew)", "Glow (Aether)"],
        datasets: [{
          data: [38, 26, 18, 12, 6],
          backgroundColor: ["#b83246", "#e6d1b1", "#592237", "#d56c7d", "#c7a67b"],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } }
        }
      }
    });
  }

  // 3. Workflow State Distribution Radar
  const radarCtx = document.getElementById("workflowRadarChart")?.getContext("2d");
  if (radarCtx) {
    state.charts.radar = new Chart(radarCtx, {
      type: "polarArea",
      data: {
        labels: ["Pending", "Confirmed", "Atelier Prep", "In Transit", "Delivered"],
        datasets: [{
          data: [2, 3, 4, 5, 8],
          backgroundColor: [
            "rgba(243, 156, 18, 0.45)",
            "rgba(52, 152, 219, 0.45)",
            "rgba(155, 89, 182, 0.45)",
            "rgba(230, 126, 34, 0.45)",
            "rgba(46, 204, 113, 0.45)"
          ],
          borderColor: "rgba(230, 209, 177, 0.2)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { display: false } } },
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } }
      }
    });
  }

  // 4. Top Shades Bar Chart
  const shadesCtx = document.getElementById("shadesBarChart")?.getContext("2d");
  if (shadesCtx) {
    state.charts.shades = new Chart(shadesCtx, {
      type: "bar",
      data: {
        labels: ["01 Crimson Atelier", "04 Rosewood Noir", "230 Warm Sand", "Nocturne Rose", "Velvet Peony", "Champagne Halo"],
        datasets: [{
          label: "Units Dispatched",
          data: [42, 31, 28, 22, 19, 15],
          backgroundColor: ["#9E2438", "#7A3E48", "#D6A888", "#8B3E4D", "#D56C7D", "#E5C8A8"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });
  }
}

function updateCharts() {
  if (state.charts.radar) {
    const stageCounts = WORKFLOW_STAGES.map(st => state.orders.filter(o => o.status === st).length);
    state.charts.radar.data.datasets[0].data = stageCounts;
    state.charts.radar.update();
  }
}

// ============================================================
// SIMULATE LIVE ORDER & CONTROLS
// ============================================================
function initSimulateButton() {
  document.getElementById("btnSimulateOrder").addEventListener("click", async () => {
    const sampleNames = ["Genevieve Laurent", "Astrid Lindholm", "Chloe Moreau", "Hanae Mori", "Victoria Sterling"];
    const sampleCities = ["Paris, France", "Stockholm, Sweden", "Lyon, France", "Tokyo, Japan", "Beverly Hills, USA"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];

    const newOrder = {
      id: crypto.randomUUID ? crypto.randomUUID() : `mv-order-${Date.now()}`,
      shipping_name: randomName,
      shipping_email: `${randomName.toLowerCase().replace(' ', '.')}@couture.com`,
      shipping_address: `Atelier Boulevard 27, ${randomCity}`,
      status: "pending",
      subtotal: 146.00,
      discount: 21.90,
      total: 124.10,
      promo_code: "VELOUR27",
      created_at: new Date().toISOString(),
      order_items: [
        { product_id: "velour-lip-sculpt", shade_name: "01 Crimson Atelier", shade_hex: "#9E2438", qty: 1, unit_price: 48.00 },
        { product_id: "chroma-eye-palette", shade_name: "Nocturne Rose", shade_hex: "#8B3E4D", qty: 1, unit_price: 82.00 }
      ]
    };

    // If Supabase is available, insert into DB
    if (supabase) {
      try {
        const { error: ordErr } = await supabase.from("orders").insert([{
          id: newOrder.id,
          shipping_name: newOrder.shipping_name,
          shipping_email: newOrder.shipping_email,
          shipping_address: newOrder.shipping_address,
          status: newOrder.status,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          total: newOrder.total,
          promo_code: newOrder.promo_code
        }]);

        if (!ordErr) {
          await supabase.from("order_items").insert(newOrder.order_items.map(i => ({
            order_id: newOrder.id,
            product_id: i.product_id,
            shade_name: i.shade_name,
            shade_hex: i.shade_hex,
            qty: i.qty,
            unit_price: i.unit_price
          })));
        }
      } catch (e) {
        console.warn("Simulate insert note:", e);
      }
    }

    state.orders.unshift(newOrder);
    renderAllViews();
    updateCharts();
    triggerRadarPulse();
    showToast(`⚡ Order Detected: #${newOrder.id.slice(0, 8)} (${newOrder.shipping_name})`);
  });

  document.getElementById("btnRefresh").addEventListener("click", () => fetchInitialData());
}

// Navigation View Switcher
function initNavigation() {
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav .nav-item").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const view = btn.dataset.view;
      state.currentView = view;

      document.querySelectorAll(".view-panel").forEach(p => p.style.display = "none");

      if (view === "orders") {
        document.getElementById("viewOrders").style.display = "block";
        document.getElementById("pageTitle").textContent = "Atelier Order Workflow";
      } else if (view === "analytics") {
        document.getElementById("viewAnalytics").style.display = "block";
        document.getElementById("pageTitle").textContent = "Couture Analytics & Performance";
        // Trigger resize on charts
        Object.values(state.charts).forEach(c => c && c.resize());
      } else if (view === "inventory") {
        document.getElementById("viewInventory").style.display = "block";
        document.getElementById("pageTitle").textContent = "Bio-Pigment Catalog Vault";
      }
    });
  });

  // Kanban vs Table View Switchers
  document.getElementById("btnKanbanView").addEventListener("click", () => {
    document.getElementById("btnKanbanView").classList.add("is-active");
    document.getElementById("btnListView").classList.remove("is-active");
    document.getElementById("workflowBoard").style.display = "grid";
    document.getElementById("tableView").style.display = "none";
  });

  document.getElementById("btnListView").addEventListener("click", () => {
    document.getElementById("btnListView").classList.add("is-active");
    document.getElementById("btnKanbanView").classList.remove("is-active");
    document.getElementById("workflowBoard").style.display = "none";
    document.getElementById("tableView").style.display = "block";
  });

  // Workflow status filter tabs
  document.querySelectorAll(".wf-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".wf-tab").forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      state.statusFilter = tab.dataset.status;
      renderAllViews();
    });
  });
}

function initSearch() {
  const input = document.getElementById("orderSearchInput");
  input.addEventListener("input", () => {
    state.searchQuery = input.value;
    renderWorkflowBoard();
    renderTableView();
  });
}

// Helpers
function showToast(msg) {
  const stack = document.getElementById("adminToastStack");
  const el = document.createElement("div");
  el.className = "admin-toast";
  el.innerHTML = `<span>✦</span><span>${escapeHTML(msg)}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

function formatTimeAgo(isoString) {
  if (!isoString) return "just now";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
