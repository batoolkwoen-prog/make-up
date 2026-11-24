-- ============================================================
-- MAISON VÉLOUR — 2027 Supabase Database Schema
-- ============================================================

-- Enable pgcrypto or gen_random_uuid() is built-in in modern Postgres
create extension if not exists "pgcrypto";

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id           text primary key,                          -- e.g. "velour-lip-sculpt"
  name         text not null,
  category     text not null check (category in ('lips','complexion','eyes','cheek')),
  badge        text,
  price        numeric(10,2) not null check (price > 0),
  subtitle     text,
  description  text,
  notes        text,
  image        text,                                       -- asset path / CDN URL
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- PRODUCT SHADES (child of products)
-- ============================================================
create table if not exists public.product_shades (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  name        text not null,
  hex         text not null,
  sort_order  int  not null default 0
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email       text,
  created_at  timestamptz not null default now()
);

-- Auto-create profile on new signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- WISHLIST
-- ============================================================
create table if not exists public.wishlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  text not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete set null,
  guest_email     text,
  status          text not null default 'pending'
                    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  subtotal        numeric(10,2) not null,
  discount        numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  promo_code      text,
  shipping_name   text,
  shipping_email  text,
  shipping_address text,
  tracking_number text,
  carrier         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  text not null references public.products(id),
  shade_name  text,
  shade_hex   text,
  qty         int  not null check (qty > 0),
  unit_price  numeric(10,2) not null
);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.products             enable row level security;
alter table public.product_shades       enable row level security;
alter table public.profiles             enable row level security;
alter table public.wishlist             enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Products & shades: public read & full access for anon/admin demo
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select using (true);

drop policy if exists "Public can read shades" on public.product_shades;
create policy "Public can read shades" on public.product_shades for select using (true);

-- Allow full management for demo admin client
drop policy if exists "Allow all on orders" on public.orders;
create policy "Allow all on orders" on public.orders for all using (true) with check (true);

drop policy if exists "Allow all on order_items" on public.order_items;
create policy "Allow all on order_items" on public.order_items for all using (true) with check (true);

drop policy if exists "Allow all on products" on public.products;
create policy "Allow all on products" on public.products for all using (true) with check (true);

drop policy if exists "Allow all on shades" on public.product_shades;
create policy "Allow all on shades" on public.product_shades for all using (true) with check (true);

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Anyone can subscribe to newsletter" on public.newsletter_subscribers for all using (true) with check (true);

-- ============================================================
-- SEED — PRODUCTS & SHADES
-- ============================================================
insert into public.products (id, name, category, badge, price, subtitle, description, notes, image) values
(
  'velour-lip-sculpt', 'Velour Lip Sculpt', 'lips', 'Best Seller', 48.00,
  'Weightless 18h Serum-Matte Lipstick',
  'Suspended hyaluronic micro-spheres wrapped in cold-milled couture pigment. Glides with cashmere drag-free precision and leaves a blurred velvet halo.',
  '94% Bio-Squalane · Refillable Fluted Obsidian Case · 3.8g',
  'assets/product-lipstick.jpg'
),
(
  'lumiere-serum-tint', 'Lumière Serum Skin Tint', 'complexion', 'Bio-Ferment', 68.00,
  'Glass-Skin Peptide Foundation Elixir',
  'A breathable serum complexion veil infused with niacinamide and light-refracting bio-pearls for an undetectable, lit-from-within editorial finish.',
  'SPF 30 Mineral Veil · Smoked Glass Dropper · 30ml',
  'assets/product-foundation.jpg'
),
(
  'chroma-eye-palette', 'Chroma-6 Obsidian Palette', 'eyes', 'Runway ''27', 82.00,
  '6-Pan Velvet Matte & Liquid Chrome',
  'Six architectural pigments spanning crushed burgundy suede, molten bronze foil, and wet-look rose-quartz shimmer in a magnetic chrome compact.',
  'Zero-Fallout Cream-to-Powder · Built-in Panoramic Mirror · 9.6g',
  'assets/product-palette.jpg'
),
(
  'petal-dew-blush', 'Petal-Dew Cheek Elixir', 'cheek', 'New Drop', 44.00,
  'Serum-Gel Luminous Liquid Blush',
  'One micro-drop melts seamlessly over bare skin or foundation, delivering a translucent, sun-flushed watercolor bloom that never lifts base makeup.',
  'Camellia Oil Complex · Faceted Frosted Vial · 14ml',
  'assets/product-blush.jpg'
),
(
  'aether-pearl-highlighter', 'Aether Liquid Pearl', 'cheek', 'Holographic', 54.00,
  'Micro-Prismatic Skin Luminizer',
  'Pure liquid pearl suspension engineered without coarse glitter. Creates a wet-glass champagne sheen along cheekbones, collarbones, and eyelids.',
  'Botanical Pearl Extract · Airless Pump · 20ml',
  'assets/product-highlighter.jpg'
),
(
  'nocturne-lip-glaze', 'Nocturne Glass Lip Oil', 'lips', 'Limited', 38.00,
  'Cushioned Peptide Mirror Gloss',
  'Non-sticky botanical lip treatment delivering liquid-glass volume and a sheer wash of atelier crimson or translucent pearl shimmer.',
  'Tri-Peptide Plump Complex · Cooling Chrome Tip · 7ml',
  'assets/editorial-look-1.jpg'
)
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  image = excluded.image;

insert into public.product_shades (product_id, name, hex, sort_order) values
-- Velour Lip Sculpt
('velour-lip-sculpt', '01 Crimson Atelier', '#9E2438', 0),
('velour-lip-sculpt', '04 Rosewood Noir',   '#7A3E48', 1),
('velour-lip-sculpt', '07 Plum Mirage',     '#592237', 2),
('velour-lip-sculpt', '12 Terracotta Silk', '#A85245', 3),
-- Lumière Serum Tint
('lumiere-serum-tint', '110 Alabaster',     '#F2DCCB', 0),
('lumiere-serum-tint', '230 Warm Sand',     '#D6A888', 1),
('lumiere-serum-tint', '340 Golden Amber',  '#B07A54', 2),
('lumiere-serum-tint', '460 Deep Espresso', '#5A3624', 3),
-- Chroma-6 Palette
('chroma-eye-palette', 'Nocturne Rose',     '#8B3E4D', 0),
('chroma-eye-palette', 'Molten Bronze',     '#9C6E4E', 1),
-- Petal-Dew Blush
('petal-dew-blush', 'Velvet Peony',         '#D56C7D', 0),
('petal-dew-blush', 'Sunlit Fig',           '#A64B58', 1),
('petal-dew-blush', 'Glazed Apricot',       '#DC8A6E', 2),
-- Aether Highlighter
('aether-pearl-highlighter', 'Champagne Halo',  '#E5C8A8', 0),
('aether-pearl-highlighter', 'Rose Quartz',     '#DFB0B6', 1),
('aether-pearl-highlighter', 'Solaris Gold',    '#D2A76A', 2),
-- Nocturne Lip Glaze
('nocturne-lip-glaze', 'Black Cherry',  '#761D2E', 0),
('nocturne-lip-glaze', 'Pearl Mirror',  '#EEDFD6', 1),
('nocturne-lip-glaze', 'Nude Glaze',    '#C28A7D', 2);

-- ============================================================
-- SEED — INITIAL DEMO ORDERS FOR WORKFLOW DETECTIONS
-- ============================================================
insert into public.orders (id, guest_email, status, subtotal, discount, total, promo_code, shipping_name, shipping_email, shipping_address, tracking_number, carrier, created_at) values
('f1a23b45-67c8-49de-8012-34567890abcd', 'clara.delacroix@vogue.fr', 'pending', 130.00, 19.50, 110.50, 'VELOUR27', 'Clara Delacroix', 'clara.delacroix@vogue.fr', '18 Rue de la Paix, 75002 Paris, France', null, null, now() - interval '18 minutes'),
('a9b8c7d6-e5f4-4321-ba09-876543210fed', 'minji.kim@atelier-seoul.kr', 'confirmed', 196.00, 0.00, 196.00, null, 'Minji Kim', 'minji.kim@atelier-seoul.kr', 'Hannam The Hill, Yongsan-gu, Seoul, Korea', null, null, now() - interval '2 hours'),
('e3d2c1b0-f9a8-4765-8123-456789abcdef', 'elena.rostova@harpers.com', 'processing', 204.00, 30.60, 173.40, 'VELOUR27', 'Elena Rostova', 'elena.rostova@harpers.com', '432 Park Ave, Apt 58B, New York, NY 10022', null, 'DHL Express', now() - interval '6 hours'),
('11223344-5566-4778-8990-aabbccddeeff', 'camille.bernard@lux.ch', 'shipped', 92.00, 0.00, 92.00, null, 'Camille Bernard', 'camille.bernard@lux.ch', 'Quai du Mont-Blanc 12, Geneva, Switzerland', 'MV-DHL-984210', 'DHL Express', now() - interval '1 day'),
('99887766-5544-4332-2110-ffeeddccbbaa', 'sophia.vanderbilt@london.co.uk', 'delivered', 274.00, 41.10, 232.90, 'VELOUR27', 'Sophia Vanderbilt', 'sophia.vanderbilt@london.co.uk', '14 Kensington Palace Gardens, London, UK', 'MV-FEDEX-44129', 'FedEx Couture Priority', now() - interval '3 days')
on conflict do nothing;

insert into public.order_items (order_id, product_id, shade_name, shade_hex, qty, unit_price) values
('f1a23b45-67c8-49de-8012-34567890abcd', 'velour-lip-sculpt', '01 Crimson Atelier', '#9E2438', 1, 48.00),
('f1a23b45-67c8-49de-8012-34567890abcd', 'chroma-eye-palette', 'Nocturne Rose', '#8B3E4D', 1, 82.00),

('a9b8c7d6-e5f4-4321-ba09-876543210fed', 'lumiere-serum-tint', '230 Warm Sand', '#D6A888', 2, 68.00),
('a9b8c7d6-e5f4-4321-ba09-876543210fed', 'petal-dew-blush', 'Velvet Peony', '#D56C7D', 1, 44.00),

('e3d2c1b0-f9a8-4765-8123-456789abcdef', 'lumiere-serum-tint', '110 Alabaster', '#F2DCCB', 1, 68.00),
('e3d2c1b0-f9a8-4765-8123-456789abcdef', 'chroma-eye-palette', 'Molten Bronze', '#9C6E4E', 1, 82.00),
('e3d2c1b0-f9a8-4765-8123-456789abcdef', 'aether-pearl-highlighter', 'Champagne Halo', '#E5C8A8', 1, 54.00),

('11223344-5566-4778-8990-aabbccddeeff', 'velour-lip-sculpt', '04 Rosewood Noir', '#7A3E48', 1, 48.00),
('11223344-5566-4778-8990-aabbccddeeff', 'petal-dew-blush', 'Sunlit Fig', '#A64B58', 1, 44.00)
on conflict do nothing;
