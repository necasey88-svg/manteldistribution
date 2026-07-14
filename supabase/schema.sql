-- Hearthline Supply Co. — core schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- after creating a new Supabase project.

create extension if not exists "pgcrypto";

-- Dealer accounts. One row per approved trade account, linked 1:1
-- to a Supabase Auth user via user_id.
create table if not exists dealers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  net_terms_days integer not null default 0,
  created_at timestamptz not null default now()
);

-- Public "Become a Dealer" applications land here before an admin
-- provisions a Supabase Auth user + approved `dealers` row.
create table if not exists dealer_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  business_type text not null,
  website text,
  expected_volume text,
  message text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'declined')),
  created_at timestamptz not null default now()
);

-- Product catalog. Replace src/lib/data/products.ts with queries
-- against this table once seeded.
create table if not exists products (
  sku text primary key,
  slug text not null unique,
  name text not null,
  material text not null check (material in ('precast', 'wood')),
  collection text not null,
  description text not null,
  price_cents integer not null,
  msrp_cents integer not null,
  lead_time_days integer not null default 14,
  dimensions text,
  weight_lbs integer,
  finish text[] not null default '{}',
  min_order_qty integer not null default 1,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Purchase orders submitted by dealers through the PO cart
-- (as opposed to instant Stripe checkout orders, see `orders`).
create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references dealers (id) on delete cascade,
  po_number text not null unique,
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'in_production', 'shipped', 'cancelled')),
  subtotal_cents integer not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists purchase_order_line_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders (id) on delete cascade,
  product_sku text not null references products (sku),
  product_name text not null,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null
);

-- Self-serve Stripe checkout orders (public site + dealer "buy now").
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references dealers (id) on delete set null,
  stripe_checkout_session_id text unique,
  customer_email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  subtotal_cents integer not null,
  created_at timestamptz not null default now()
);

create table if not exists order_line_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_sku text not null references products (sku),
  product_name text not null,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null
);

-- Row Level Security
alter table dealers enable row level security;
alter table dealer_applications enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_line_items enable row level security;
alter table orders enable row level security;
alter table order_line_items enable row level security;
alter table products enable row level security;

-- Products are readable by anyone (public catalog).
create policy "products are publicly readable"
  on products for select
  using (true);

-- Dealers can read their own dealer record.
create policy "dealers can read own record"
  on dealers for select
  using (auth.uid() = user_id);

-- Dealers can read/insert their own purchase orders.
create policy "dealers can read own purchase orders"
  on purchase_orders for select
  using (
    dealer_id in (select id from dealers where user_id = auth.uid())
  );

create policy "dealers can insert own purchase orders"
  on purchase_orders for insert
  with check (
    dealer_id in (select id from dealers where user_id = auth.uid())
  );

create policy "dealers can read own po line items"
  on purchase_order_line_items for select
  using (
    purchase_order_id in (
      select po.id from purchase_orders po
      join dealers d on d.id = po.dealer_id
      where d.user_id = auth.uid()
    )
  );

create policy "dealers can insert own po line items"
  on purchase_order_line_items for insert
  with check (
    purchase_order_id in (
      select po.id from purchase_orders po
      join dealers d on d.id = po.dealer_id
      where d.user_id = auth.uid()
    )
  );

-- Dealer applications: anyone can submit (insert), only the
-- service role (admin tooling) can read them back.
create policy "anyone can submit a dealer application"
  on dealer_applications for insert
  with check (true);

-- Orders: dealers can see their own; anonymous checkout orders are
-- written/read only via the service-role key in the API routes.
create policy "dealers can read own orders"
  on orders for select
  using (
    dealer_id in (select id from dealers where user_id = auth.uid())
  );
