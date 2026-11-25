/* ============================================================
   MAISON VÉLOUR — 2027 MOTION ENGINE & E-COMMERCE STOREFRONT
   ============================================================ */

// Supabase Client for Real Production Orders
const STORE_SUPABASE_URL = "https://wjchyhnoafkbyosfffqh.supabase.co";
const STORE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqY2h5aG5vYWZrYnlvc2ZmZnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1NTY1NTEsImV4cCI6MjExMTEzMjU1MX0.l7ZA3A2cZj3Pzd4TLLtMc3K2uNCyQYRkVDochJGIO6o";
const storeSupabase = (window.supabase && typeof window.supabase.createClient === "function") 
  ? window.supabase.createClient(STORE_SUPABASE_URL, STORE_SUPABASE_ANON_KEY) 
  : null;

const PRODUCTS = [
  {
    id: "velour-lip-sculpt",
    name: "Velour Lip Sculpt",
    category: "lips",
    badge: "Best Seller",
    price: 48,
    subtitle: "Weightless 18h Serum-Matte Lipstick",
    description:
      "Suspended hyaluronic micro-spheres wrapped in cold-milled couture pigment. Glides with cashmere drag-free precision and leaves a blurred velvet halo.",
    notes: "94% Bio-Squalane · Refillable Fluted Obsidian Case · 3.8g",
    image: "assets/product-lipstick.jpg",
    shades: [
      { name: "01 Crimson Atelier", hex: "#9E2438" },
      { name: "04 Rosewood Noir", hex: "#7A3E48" },
      { name: "07 Plum Mirage", hex: "#592237" },
      { name: "12 Terracotta Silk", hex: "#A85245" }
    ]
  },
  {
    id: "lumiere-serum-tint",
    name: "Lumière Serum Skin Tint",
    category: "complexion",
    badge: "Bio-Ferment",
    price: 68,
    subtitle: "Glass-Skin Peptide Foundation Elixir",
    description:
      "A breathable serum complexion Veil infused with niacinamide and light-refracting bio-pearls for an undetectable, lit-from-within editorial finish.",
    notes: "SPF 30 Mineral Veil · Smoked Glass Dropper · 30ml",
    image: "assets/product-foundation.jpg",
    shades: [
      { name: "110 Alabaster", hex: "#F2DCCB" },
      { name: "230 Warm Sand", hex: "#D6A888" },
      { name: "340 Golden Amber", hex: "#B07A54" },
      { name: "460 Deep Espresso", hex: "#5A3624" }
    ]
  },
  {
    id: "chroma-eye-palette",
    name: "Chroma-6 Obsidian Palette",
    category: "eyes",
    badge: "Runway ’27",
    price: 82,
    subtitle: "6-Pan Velvet Matte & Liquid Chrome",
    description:
      "Six architectural pigments spanning crushed burgundy suede, molten bronze foil, and wet-look rose-quartz shimmer in a magnetic chrome compact.",
    notes: "Zero-Fallout Cream-to-Powder · Built-in Panoramic Mirror · 9.6g",
    image: "assets/product-palette.jpg",
    shades: [
      { name: "Nocturne Rose", hex: "#8B3E4D" },
      { name: "Molten Bronze", hex: "#9C6E4E" }
    ]
  },
  {
    id: "petal-dew-blush",
    name: "Petal-Dew Cheek Elixir",
    category: "cheek",
    badge: "New Drop",
    price: 44,
    subtitle: "Serum-Gel Luminous Liquid Blush",
    description:
      "One micro-drop melts seamlessly over bare skin or foundation, delivering a translucent, sun-flushed watercolor bloom that never lifts base makeup.",
    notes: "Camellia Oil Complex · Faceted Frosted Vial · 14ml",
    image: "assets/product-blush.jpg",
    shades: [
      { name: "Velvet Peony", hex: "#D56C7D" },
      { name: "Sunlit Fig", hex: "#A64B58" },
      { name: "Glazed Apricot", hex: "#DC8A6E" }
    ]
  },
  {
    id: "aether-pearl-highlighter",
    name: "Aether Liquid Pearl",
    category: "cheek",
    badge: "Holographic",
    price: 54,
    subtitle: "Micro-Prismatic Skin Luminizer",
    description:
      "Pure liquid pearl suspension engineered without coarse glitter. Creates a wet-glass champagne sheen along cheekbones, collarbones, and eyelids.",
    notes: "Botanical Pearl Extract · Airless Pump · 20ml",
    image: "assets/product-highlighter.jpg",
    shades: [
      { name: "Champagne Halo", hex: "#E5C8A8" },
      { name: "Rose Quartz", hex: "#DFB0B6" },
      { name: "Solaris Gold", hex: "#D2A76A" }
    ]
  },
  {
    id: "nocturne-lip-glaze",
    name: "Nocturne Glass Lip Oil",
    category: "lips",
    badge: "Limited",
    price: 38,
    subtitle: "Cushioned Peptide Mirror Gloss",
    description:
      "Non-sticky botanical lip treatment delivering liquid-glass volume and a sheer wash of atelier crimson or translucent pearl shimmer.",
    notes: "Tri-Peptide Plump Complex · Cooling Chrome Tip · 7ml",
    image: "assets/editorial-look-1.jpg",
    shades: [
      { name: "Black Cherry", hex: "#761D2E" },
      { name: "Pearl Mirror", hex: "#EEDFD6" },
      { name: "Nude Glaze", hex: "#C28A7D" }
    ]
  }
];

const SKIN_TONES = [
  { label: "Tone 01 — Porcelain Ivory", bg: "radial-gradient(circle at 35% 30%, #fae7db 0%, #e5c3ae 75%)", match: "99%" },
  { label: "Tone 02 — Soft Almond", bg: "radial-gradient(circle at 35% 30%, #f0cfb9 0%, #d3a78a 75%)", match: "98%" },
  { label: "Tone 03 — Warm Sand", bg: "radial-gradient(circle at 35% 30%, #e4b697 0%, #c18b69 75%)", match: "98%" },
  { label: "Tone 04 — Golden Honey", bg: "radial-gradient(circle at 35% 30%, #c98f68 0%, #9b6442 75%)", match: "97%" },
  { label: "Tone 05 — Rich Chestnut", bg: "radial-gradient(circle at 35% 30%, #9a6244 0%, #6d3e27 75%)", match: "99%" },
  { label: "Tone 06 — Deep Espresso", bg: "radial-gradient(circle at 35% 30%, #6b412c 0%, #3d2115 75%)", match: "99%" }
];

const state = {
  category: "all",
  sort: "featured",
  promoApplied: false,
  selectedShades: {},
  bag: JSON.parse(localStorage.getItem("velour_bag") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("velour_wishlist") || "[]"),
  lab: {
    toneIdx: 2,
    finish: "velvet",
    shade: "Crimson Atelier",
    hex: "#9E2438",
    productId: "velour-lip-sculpt"
  }
};

PRODUCTS.forEach((p) => {
  state.selectedShades[p.id] = 0;
});

// ==================== PRELOADER ====================
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("preloaderBar");
  const counter = document.getElementById("preloaderCounter");
  let progress = 0;

  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      bar.style.width = "100%";
      counter.textContent = "100";
      setTimeout(() => {
        preloader.classList.add("is-done");
        document.body.classList.add("is-loaded");
      }, 260);
      return;
    }
    bar.style.width = `${progress}%`;
    counter.textContent = String(progress).padStart(2, "0");
  }, 55);
}

// ==================== CUSTOM MAGNETIC CURSOR ====================
function initCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorLabel");

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    const target = e.target.closest("[data-cursor]");
    if (target) {
      label.textContent = target.dataset.cursor;
      ring.classList.add("is-labeled");
    } else {
      ring.classList.remove("is-labeled");
    }
  });

  function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
      btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

// ==================== HERO FLUID BIOLUMINESCENT CANVAS ====================
function initHeroFluidCanvas() {
  const canvas = document.getElementById("heroFluidCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;
  let pointerX = 0.5, pointerY = 0.45;
  let time = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    pointerX += (e.clientX / Math.max(window.innerWidth, 1) - pointerX) * 0.15;
    pointerY += (e.clientY / Math.max(window.innerHeight, 1) - pointerY) * 0.15;
  });

  const blobs = [
    { cx: 0.28, cy: 0.35, r: 0.34, color: "rgba(184, 50, 70, 0.26)", speed: 0.6 },
    { cx: 0.72, cy: 0.3, r: 0.3, color: "rgba(230, 209, 177, 0.14)", speed: -0.45 },
    { cx: 0.52, cy: 0.72, r: 0.38, color: "rgba(122, 42, 74, 0.24)", speed: 0.38 }
  ];

  function render() {
    time += 0.008;
    ctx.clearRect(0, 0, w, h);

    blobs.forEach((b, idx) => {
      const x = (b.cx + Math.sin(time * b.speed + idx) * 0.08 + (pointerX - 0.5) * 0.12) * w;
      const y = (b.cy + Math.cos(time * b.speed + idx * 1.7) * 0.08 + (pointerY - 0.5) * 0.12) * h;
      const radius = Math.max(w, h) * b.r;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, "rgba(9, 8, 10, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    requestAnimationFrame(render);
  }
  render();
}

// ==================== SCROLL CHOREOGRAPHY ENGINE ====================
function initScrollChoreography() {
  const header = document.getElementById("siteHeader");
  const progressFill = document.getElementById("scrollProgressFill");
  const heroLineLeft = document.getElementById("heroLineLeft");
  const heroLineRight = document.getElementById("heroLineRight");
  const heroArchWrap = document.getElementById("heroArchWrap");
  const manifesto = document.getElementById("manifestoText");
  const marqueeTrack = document.getElementById("marqueeTrackTop");

  // Split manifesto into individual words for scroll-scrubbed illumination
  const rawWords = manifesto.textContent.trim().split(/\s+/);
  manifesto.innerHTML = rawWords
    .map((word) => `<span class="manifesto-word">${word}</span>`)
    .join(" ");
  const wordNodes = [...manifesto.querySelectorAll(".manifesto-word")];

  // Runway horizontal scroll elements
  const runwaySection = document.getElementById("runway");
  const runwayTrack = document.getElementById("runwayTrack");
  const runwayBarFill = document.getElementById("runwayBarFill");
  const runwayChapterLabel = document.getElementById("runwayChapterLabel");

  let marqueeOffset = 0;
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  function onFrame() {
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const docProgress = maxScroll > 0 ? (sy / maxScroll) * 100 : 0;

    scrollVelocity += (sy - lastScrollY - scrollVelocity) * 0.2;
    lastScrollY = sy;

    // Header + top rail
    header.classList.toggle("is-scrolled", sy > 40);
    progressFill.style.width = `${docProgress.toFixed(2)}%`;

    // Hero scroll-linked split & zoom
    const heroProgress = Math.min(Math.max(sy / (vh * 0.9), 0), 1);
    if (heroLineLeft && heroLineRight && heroArchWrap) {
      heroLineLeft.style.transform = `translate3d(${-heroProgress * 110}px, 0, 0)`;
      heroLineRight.style.transform = `translate3d(${heroProgress * 110}px, 0, 0)`;
      const scale = 1 + heroProgress * 0.14;
      heroArchWrap.style.transform = `translate3d(0, ${heroProgress * -28}px, 0) scale(${scale})`;
    }

    // Marquee kinetic speed boosted by scroll velocity
    if (marqueeTrack) {
      const halfWidth = marqueeTrack.scrollWidth / 2;
      const speed = 0.75 + Math.min(Math.abs(scrollVelocity) * 0.14, 5);
      marqueeOffset -= speed;
      if (Math.abs(marqueeOffset) >= halfWidth) marqueeOffset = 0;
      marqueeTrack.style.transform = `translate3d(${marqueeOffset}px, 0, 0)`;
    }

    // Manifesto scroll-scrubbed word illumination
    const mRect = manifesto.getBoundingClientRect();
    const mProgress = Math.min(Math.max((vh * 0.85 - mRect.top) / (mRect.height + vh * 0.4), 0), 1);
    const litCount = Math.floor(mProgress * wordNodes.length);
    wordNodes.forEach((node, idx) => {
      node.classList.toggle("is-lit", idx <= litCount);
    });

    // Parallax image inside Atelier
    document.querySelectorAll(".parallax-frame").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const speed = parseFloat(el.dataset.speed || "-0.08");
      el.style.setProperty("--py", `${centerOffset * speed}px`);
    });

    // Horizontal Pinned Runway (desktop)
    if (window.innerWidth > 760 && runwaySection && runwayTrack) {
      const rRect = runwaySection.getBoundingClientRect();
      const totalTravel = runwaySection.offsetHeight - vh;
      const passed = Math.min(Math.max(-rRect.top, 0), totalTravel);
      const ratio = totalTravel > 0 ? passed / totalTravel : 0;
      const maxX = Math.max(runwayTrack.scrollWidth - window.innerWidth * 0.9, 0);
      const skew = Math.max(Math.min(scrollVelocity * -0.06, 4), -4);

      runwayTrack.style.transform = `translate3d(${-ratio * maxX}px, 0, 0) skewX(${skew}deg)`;
      runwayBarFill.style.width = `${(ratio * 100).toFixed(1)}%`;
      const lookIndex = Math.min(4, Math.floor(ratio * 4) + 1);
      runwayChapterLabel.textContent = `LOOK 0${lookIndex} / 04`;
    }

    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);

  // IntersectionObserver for clip-masks, reveals & count-ups
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");

        if (entry.target.dataset.count && !entry.target.dataset.counted) {
          entry.target.dataset.counted = "1";
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal-up, .clip-reveal-frame, [data-count]").forEach((el) => {
    io.observe(el);
    if (el.dataset.count && !el.dataset.counted && el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.counted = "1";
      animateCounter(el);
    }
  });
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ==================== PRODUCT CATALOG & 3D TILT CARDS ====================
function renderProducts() {
  const grid = document.getElementById("productGrid");
  let list = [...PRODUCTS];

  if (state.category !== "all") {
    list = list.filter((p) => p.category === state.category);
  }
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);

  grid.innerHTML = list
    .map((product) => {
      const shadeIdx = state.selectedShades[product.id] || 0;
      const activeShade = product.shades[shadeIdx];
      const isSaved = state.wishlist.includes(product.id);

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-media" data-cursor="INSPECT">
            <img src="${product.image}" alt="${product.name} — ${activeShade.name}" />
            <span class="product-badge">${product.badge}</span>
            <button class="wish-btn ${isSaved ? "is-saved" : ""}" data-wish="${product.id}" aria-label="Save ${product.name}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 20.5s-7.5-4.7-9.5-9.2C.9 7.8 3.2 4.5 6.8 4.5c2 0 3.7 1 5.2 2.8 1.5-1.8 3.2-2.8 5.2-2.8 3.6 0 5.9 3.3 4.3 6.8-2 4.5-9.5 9.2-9.5 9.2Z" />
              </svg>
            </button>
            <button class="quickview-trigger" data-qv="${product.id}">Quick View</button>
          </div>

          <div class="product-info">
            <div class="product-top-row">
              <h3 class="product-title">${product.name}</h3>
              <span class="product-price">$${product.price}</span>
            </div>
            <p class="product-sub">${product.subtitle}</p>

            <div class="swatch-row">
              <div class="swatch-dots">
                ${product.shades
                  .map(
                    (s, idx) => `
                  <button
                    class="swatch-dot ${idx === shadeIdx ? "is-active" : ""}"
                    style="background:${s.hex}"
                    data-product="${product.id}"
                    data-shade-idx="${idx}"
                    aria-label="Select shade ${s.name}"
                    title="${s.name}"
                  ></button>
                `
                  )
                  .join("")}
              </div>
              <span class="swatch-name">${activeShade.name}</span>
            </div>

            <button class="card-add-btn" data-add="${product.id}" data-cursor="ADD">
              <span>Add to Bag</span>
              <span>+$${product.price}</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  attachCardInteractions();
}

function attachCardInteractions() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 7;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".swatch-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const id = dot.dataset.product;
      state.selectedShades[id] = parseInt(dot.dataset.shadeIdx, 10);
      renderProducts();
    });
  });

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.add;
      const idx = state.selectedShades[id] || 0;
      addToBag(id, idx);
    });
  });

  document.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", () => toggleWishlist(btn.dataset.wish));
  });

  document.querySelectorAll("[data-qv]").forEach((btn) => {
    btn.addEventListener("click", () => openQuickView(btn.dataset.qv));
  });
}

// ==================== SHOPPING BAG & WISHLIST ====================
function persistState() {
  localStorage.setItem("velour_bag", JSON.stringify(state.bag));
  localStorage.setItem("velour_wishlist", JSON.stringify(state.wishlist));
}

function addToBag(productId, shadeIdx = 0, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const shade = product.shades[shadeIdx] || product.shades[0];
  const existing = state.bag.find((item) => item.id === productId && item.shadeName === shade.name);

  if (existing) {
    existing.qty += qty;
  } else {
    state.bag.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shadeName: shade.name,
      shadeHex: shade.hex,
      qty
    });
  }

  persistState();
  renderBag();
  openDrawer("bagDrawer");
  showToast(`Added ${product.name} (${shade.name}) to bag`);
}

function addCustomShadeToBag(productId, shadeName, shadeHex) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  const existing = state.bag.find((item) => item.id === productId && item.shadeName === shadeName);
  if (existing) {
    existing.qty += 1;
  } else {
    state.bag.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shadeName,
      shadeHex,
      qty: 1
    });
  }
  persistState();
  renderBag();
  openDrawer("bagDrawer");
  showToast(`Added matched shade ${shadeName} to bag`);
}

function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (idx >= 0) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed ${product.name} from wishlist`);
  } else {
    state.wishlist.push(productId);
    showToast(`Saved ${product.name} to wishlist`);
  }
  persistState();
  renderProducts();
  renderWishlist();
}

function renderBag() {
  const countEl = document.getElementById("bagCount");
  const container = document.getElementById("bagItems");
  const subtotalEl = document.getElementById("bagSubtotal");
  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("bagDiscount");
  const totalEl = document.getElementById("bagTotal");
  const meterText = document.getElementById("shippingMeterText");
  const meterFill = document.getElementById("shippingFill");

  const totalUnits = state.bag.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = state.bag.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = state.promoApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;

  countEl.textContent = totalUnits;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  if (state.promoApplied && subtotal > 0) {
    discountRow.hidden = false;
    discountEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.hidden = true;
  }

  const threshold = 120;
  const remain = Math.max(0, threshold - total);
  const pct = Math.min(100, (total / threshold) * 100);
  meterFill.style.width = `${pct}%`;
  meterText.innerHTML =
    remain === 0
      ? "<strong>Complimentary</strong> express couture courier unlocked ✦"
      : `Add <strong>$${remain.toFixed(0)}</strong> for complimentary express courier`;

  if (state.bag.length === 0) {
    container.innerHTML = `
      <div class="bag-empty">
        <p class="mono-tag">BAG IS EMPTY</p>
        <p style="margin-top:10px">Explore our 2027 serum-infused pigments to begin your curation.</p>
      </div>`;
    return;
  }

  container.innerHTML = state.bag
    .map(
      (item, idx) => `
      <div class="bag-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="bag-item-meta">
          <div>
            <div class="bag-item-top">
              <span class="bag-item-title">${item.name}</span>
              <span class="mono-tag">$${(item.price * item.qty).toFixed(0)}</span>
            </div>
            <div class="bag-item-shade">
              <i style="background:${item.shadeHex}"></i>
              <span>${item.shadeName}</span>
            </div>
          </div>
          <div class="bag-item-actions">
            <div class="qty-stepper">
              <button data-qty-minus="${idx}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button data-qty-plus="${idx}" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-item-btn" data-remove="${idx}">Remove</button>
          </div>
        </div>
      </div>`
    )
    .join("");

  container.querySelectorAll("[data-qty-minus]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = parseInt(b.dataset.qtyMinus, 10);
      if (state.bag[i].qty > 1) state.bag[i].qty -= 1;
      else state.bag.splice(i, 1);
      persistState();
      renderBag();
    })
  );

  container.querySelectorAll("[data-qty-plus]").forEach((b) =>
    b.addEventListener("click", () => {
      const i = parseInt(b.dataset.qtyPlus, 10);
      state.bag[i].qty += 1;
      persistState();
      renderBag();
    })
  );

  container.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      state.bag.splice(parseInt(b.dataset.remove, 10), 1);
      persistState();
      renderBag();
    })
  );
}

function renderWishlist() {
  document.getElementById("wishlistCount").textContent = state.wishlist.length;
  const container = document.getElementById("wishlistItems");
  if (state.wishlist.length === 0) {
    container.innerHTML = `<div class="bag-empty"><p class="mono-tag">NO SAVED SHADES YET</p></div>`;
    return;
  }

  container.innerHTML = state.wishlist
    .map((id) => {
      const p = PRODUCTS.find((item) => item.id === id);
      if (!p) return "";
      return `
        <div class="bag-item">
          <img src="${p.image}" alt="${p.name}" />
          <div class="bag-item-meta">
            <div class="bag-item-top">
              <span class="bag-item-title">${p.name}</span>
              <span class="mono-tag">$${p.price}</span>
            </div>
            <p class="product-sub">${p.subtitle}</p>
            <div class="bag-item-actions">
              <button class="btn-inline" data-wish-add="${p.id}">Move to Bag →</button>
              <button class="remove-item-btn" data-wish-remove="${p.id}">Remove</button>
            </div>
          </div>
        </div>`;
    })
    .join("");

  container.querySelectorAll("[data-wish-add]").forEach((b) =>
    b.addEventListener("click", () => {
      addToBag(b.dataset.wishAdd, 0);
    })
  );
  container.querySelectorAll("[data-wish-remove]").forEach((b) =>
    b.addEventListener("click", () => toggleWishlist(b.dataset.wishRemove))
  );
}

// ==================== DRAWERS & MODALS ====================
function openDrawer(drawerId) {
  closeAllOverlays();
  document.getElementById("drawerBackdrop").classList.add("is-open");
  const drawer = document.getElementById(drawerId);
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeAllOverlays() {
  document.getElementById("drawerBackdrop").classList.remove("is-open");
  ["bagDrawer", "wishlistDrawer"].forEach((id) => {
    const el = document.getElementById(id);
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
  });
  ["quickViewModal", "checkoutModal", "searchOverlay"].forEach((id) => {
    const el = document.getElementById(id);
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
  });
}

function openQuickView(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;
  let shadeIdx = state.selectedShades[productId] || 0;
  const body = document.getElementById("quickViewBody");

  function draw() {
    const shade = product.shades[shadeIdx];
    body.innerHTML = `
      <div class="qv-img-wrap">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="qv-details">
        <span class="mono-tag">${product.badge} · ${product.category}</span>
        <h3>${product.name}</h3>
        <div class="qv-price">$${product.price}.00</div>
        <p class="qv-desc">${product.description}</p>
        <div class="swatch-row" style="margin-bottom:12px">
          <div class="swatch-dots">
            ${product.shades
              .map(
                (s, i) => `
              <button class="swatch-dot ${i === shadeIdx ? "is-active" : ""}" style="background:${s.hex}" data-qv-shade="${i}" aria-label="${s.name}"></button>`
              )
              .join("")}
          </div>
          <span class="swatch-name">${shade.name}</span>
        </div>
        <div class="qv-notes">${product.notes}</div>
        <button class="btn-primary" id="qvAddBtn" style="width:100%">
          <span>Add ${shade.name} to Bag — $${product.price}</span>
        </button>
      </div>`;

    body.querySelectorAll("[data-qv-shade]").forEach((dot) =>
      dot.addEventListener("click", () => {
        shadeIdx = parseInt(dot.dataset.qvShade, 10);
        state.selectedShades[productId] = shadeIdx;
        draw();
        renderProducts();
      })
    );

    document.getElementById("qvAddBtn").addEventListener("click", () => {
      closeAllOverlays();
      addToBag(productId, shadeIdx);
    });
  }

  draw();
  const modal = document.getElementById("quickViewModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function openCheckout() {
  if (state.bag.length === 0) {
    showToast("Add an item to your bag first");
    return;
  }
  const subtotal = state.bag.reduce((s, i) => s + i.price * i.qty, 0);
  const total = state.promoApplied ? subtotal * 0.85 : subtotal;
  const content = document.getElementById("checkoutContent");

  content.innerHTML = `
    <span class="mono-tag">ATELIER CONCIERGE CHECKOUT</span>
    <h3 style="font-family:var(--font-serif);font-size:2rem;font-weight:400;margin:6px 0">Complete Order — $${total.toFixed(2)}</h3>
    <p style="color:var(--ink-muted);font-size:0.88rem">Complimentary silk ribbon packaging included with every 2027 order.</p>
    <form class="checkout-form" id="simCheckoutForm">
      <input type="text" id="checkoutFullName" placeholder="Full Name" required />
      <input type="email" id="checkoutEmail" placeholder="Email for Digital Atelier Receipt" required />
      <input type="text" id="checkoutAddress" placeholder="Shipping Address, City" required />
      <div class="checkout-row">
        <input type="text" id="checkoutPostal" placeholder="Postal Code" required />
        <input type="text" id="checkoutCountry" placeholder="Country" value="France" required />
      </div>
      <button type="submit" class="btn-primary" style="width:100%;margin-top:6px">Confirm Couture Order</button>
    </form>`;

  document.getElementById("simCheckoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Order...";

    const fullName = document.getElementById("checkoutFullName").value.trim();
    const email = document.getElementById("checkoutEmail").value.trim();
    const address = document.getElementById("checkoutAddress").value.trim();
    const postal = document.getElementById("checkoutPostal").value.trim();
    const country = document.getElementById("checkoutCountry").value.trim();
    const fullAddress = `${address}, ${postal}, ${country}`;

    const orderId = crypto.randomUUID ? crypto.randomUUID() : `mv-${Date.now()}`;
    const orderNum = `MV-27-${Math.floor(1000 + Math.random() * 9000)}`;

    const currentBag = [...state.bag];
    const discountAmount = state.promoApplied ? subtotal * 0.15 : 0;
    const finalTotal = subtotal - discountAmount;

    // Insert Real Order to Supabase Database
    if (storeSupabase) {
      try {
        const { error: orderErr } = await storeSupabase.from("orders").insert([{
          id: orderId,
          shipping_name: fullName,
          shipping_email: email,
          guest_email: email,
          shipping_address: fullAddress,
          status: "pending",
          subtotal: subtotal,
          discount: discountAmount,
          total: finalTotal,
          promo_code: state.promoApplied ? "VELOUR27" : null
        }]);

        if (orderErr) throw orderErr;

        // Insert Order Items
        const orderItems = currentBag.map(item => ({
          order_id: orderId,
          product_id: item.id,
          shade_name: item.shadeName,
          shade_hex: item.shadeHex,
          qty: item.qty,
          unit_price: item.price
        }));

        const { error: itemsErr } = await storeSupabase.from("order_items").insert(orderItems);
        if (itemsErr) console.warn("Order items sync note:", itemsErr);
      } catch (err) {
        console.error("Order Supabase push error:", err);
      }
    }

    state.bag = [];
    state.promoApplied = false;
    persistState();
    renderBag();

    content.innerHTML = `
      <div class="order-success">
        <div class="order-success-mark">✓</div>
        <span class="mono-tag">ORDER CONFIRMED · ${orderNum}</span>
        <h3 style="font-family:var(--font-serif);font-size:2rem;font-weight:400;margin:8px 0">Merci, ${fullName}. Your curation is placed.</h3>
        <p style="color:var(--ink-muted);font-size:0.9rem;margin-bottom:20px">Your order is logged directly into our Atelier system and Paris fulfillment queue.</p>
        <button class="btn-primary" id="doneOrderBtn">Return to Storefront</button>
      </div>`;
    document.getElementById("doneOrderBtn").addEventListener("click", closeAllOverlays);
  });

  closeAllOverlays();
  const modal = document.getElementById("checkoutModal");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

// ==================== ATELIER SHADE LAB ====================
function initShadeLab() {
  const toneRange = document.getElementById("skinToneRange");
  const toneReadout = document.getElementById("skinToneReadout");
  const stageSkin = document.getElementById("labStageSkin");
  const swatch = document.getElementById("labPigmentSwatch");
  const hudFinish = document.getElementById("labHudFinish");
  const hudShade = document.getElementById("labHudShade");
  const harmony = document.getElementById("harmonyScore");
  const priceTag = document.getElementById("labPriceTag");

  function syncLab() {
    const tone = SKIN_TONES[state.lab.toneIdx];
    const prod = PRODUCTS.find((p) => p.id === state.lab.productId) || PRODUCTS[0];
    toneReadout.textContent = tone.label;
    stageSkin.style.background = tone.bg;
    swatch.style.background = state.lab.hex;
    swatch.setAttribute("data-finish", state.lab.finish);
    hudFinish.textContent = `FINISH: ${state.lab.finish.toUpperCase()}`;
    hudShade.textContent = `${state.lab.shade} · ${prod.name}`;
    harmony.textContent = `${tone.match} Undertone Match`;
    priceTag.textContent = `$${prod.price}`;
  }

  toneRange.addEventListener("input", () => {
    state.lab.toneIdx = parseInt(toneRange.value, 10);
    syncLab();
  });

  document.querySelectorAll(".finish-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".finish-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.lab.finish = btn.dataset.finish;
      syncLab();
    });
  });

  document.querySelectorAll(".lab-shade-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".lab-shade-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.lab.shade = chip.dataset.shade;
      state.lab.hex = chip.dataset.hex;
      state.lab.productId = chip.dataset.product;
      syncLab();
    });
  });

  document.getElementById("addLabMatchBtn").addEventListener("click", () => {
    addCustomShadeToBag(state.lab.productId, state.lab.shade, state.lab.hex);
  });

  syncLab();
}

// ==================== BEFORE / AFTER COMPARISON SCRUBBER ====================
function initCompareScrubber() {
  const widget = document.getElementById("compareWidget");
  const beforeLayer = document.getElementById("compareBefore");
  const divider = document.getElementById("compareDivider");
  let dragging = false;
  let currentPct = 50;

  function setPosition(pct) {
    currentPct = Math.min(95, Math.max(5, pct));
    beforeLayer.style.clipPath = `inset(0 ${100 - currentPct}% 0 0)`;
    divider.style.left = `${currentPct}%`;
    divider.setAttribute("aria-valuenow", String(Math.round(currentPct)));
  }

  function updateFromClientX(clientX) {
    const rect = widget.getBoundingClientRect();
    setPosition(((clientX - rect.left) / rect.width) * 100);
  }

  widget.addEventListener("pointerdown", (e) => {
    dragging = true;
    updateFromClientX(e.clientX);
  });
  window.addEventListener("pointermove", (e) => {
    if (dragging) updateFromClientX(e.clientX);
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
  });
  divider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setPosition(currentPct - 4);
    if (e.key === "ArrowRight") setPosition(currentPct + 4);
  });
}

// ==================== LIVE SEARCH ====================
function initSearch() {
  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  function openSearch() {
    closeAllOverlays();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    renderResults("");
    setTimeout(() => input.focus(), 60);
  }

  function renderResults(q) {
    const query = q.trim().toLowerCase();
    const hits = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.shades.some((s) => s.name.toLowerCase().includes(query))
    );

    results.innerHTML =
      hits.length === 0
        ? `<p style="color:var(--ink-muted);padding:12px">No formulations matched "${q}".</p>`
        : hits
            .map(
              (p) => `
          <button class="search-hit" data-search-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <strong>${p.name}</strong> — <span style="color:var(--accent-champagne)">$${p.price}</span>
              <div style="font-size:0.8rem;color:var(--ink-muted)">${p.subtitle} · ${p.shades.map((s) => s.name).join(", ")}</div>
            </div>
          </button>`
            )
            .join("");

    results.querySelectorAll("[data-search-id]").forEach((btn) =>
      btn.addEventListener("click", () => {
        closeAllOverlays();
        openQuickView(btn.dataset.searchId);
      })
    );
  }

  document.getElementById("searchToggleBtn").addEventListener("click", openSearch);
  document.getElementById("closeSearchBtn").addEventListener("click", closeAllOverlays);
  input.addEventListener("input", () => renderResults(input.value));

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeAllOverlays();
    }
  });
}

// ==================== TOASTS & GLOBAL EVENTS ====================
function showToast(msg) {
  const stack = document.getElementById("toastStack");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

function initUIEvents() {
  document.getElementById("categoryFilters").addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    document.querySelectorAll(".filter-pill").forEach((p) => {
      p.classList.remove("is-active");
      p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("is-active");
    pill.setAttribute("aria-selected", "true");
    state.category = pill.dataset.category;
    renderProducts();
  });

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  document.getElementById("bagToggleBtn").addEventListener("click", () => openDrawer("bagDrawer"));
  document.getElementById("wishlistToggleBtn").addEventListener("click", () => openDrawer("wishlistDrawer"));
  document.getElementById("closeBagBtn").addEventListener("click", closeAllOverlays);
  document.getElementById("closeWishlistBtn").addEventListener("click", closeAllOverlays);
  document.getElementById("closeQuickViewBtn").addEventListener("click", closeAllOverlays);
  document.getElementById("closeCheckoutBtn").addEventListener("click", closeAllOverlays);
  document.getElementById("drawerBackdrop").addEventListener("click", closeAllOverlays);
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

  document.querySelectorAll(".shop-look-btn").forEach((btn) =>
    btn.addEventListener("click", () => openQuickView(btn.dataset.productId))
  );

  document.getElementById("promoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = document.getElementById("promoInput").value.trim().toUpperCase();
    if (code === "VELOUR27") {
      state.promoApplied = true;
      renderBag();
      showToast("Atelier privilege VELOUR27 applied (15% off)");
    } else {
      showToast("Try code VELOUR27 for 15% off");
    }
  });

  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    document.getElementById("newsletterMsg").textContent = `Welcome to the private list, ${email}.`;
    e.target.reset();
  });

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileNavDrawer");
  mobileMenuBtn.addEventListener("click", () => {
    mobileDrawer.classList.toggle("is-open");
  });
  mobileDrawer.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mobileDrawer.classList.remove("is-open"))
  );
}

// ==================== BOOT ====================
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initCursor();
  initHeroFluidCanvas();
  renderProducts();
  renderBag();
  renderWishlist();
  initShadeLab();
  initCompareScrubber();
  initSearch();
  initUIEvents();
  initScrollChoreography();
});
