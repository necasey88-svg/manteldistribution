-- Hearthline dealer portal v1
-- Adds account activation, tier pricing, fulfillment tracking, and a private
-- manufacturing translation table to an existing Hearthline database.

alter table dealers add column if not exists account_number text;
alter table dealers add column if not exists pricing_tier text not null default 'approved';
alter table dealers add column if not exists discount_bps integer not null default 0;
alter table dealers add column if not exists billing_address text;
alter table dealers add column if not exists shipping_address text;
alter table dealers add column if not exists resale_certificate_status text not null default 'needed';
alter table dealers add column if not exists sales_rep text;
alter table dealers add column if not exists approved_at timestamptz;
alter table dealers drop constraint if exists dealers_pricing_tier_check;
alter table dealers add constraint dealers_pricing_tier_check
  check (pricing_tier in ('approved', 'stocking', 'program', 'national'));
alter table dealers drop constraint if exists dealers_discount_bps_check;
alter table dealers add constraint dealers_discount_bps_check
  check (discount_bps between 0 and 1500);
alter table dealers drop constraint if exists dealers_resale_certificate_status_check;
alter table dealers add constraint dealers_resale_certificate_status_check
  check (resale_certificate_status in ('needed', 'received', 'verified'));

create unique index if not exists dealers_email_unique on dealers (email);
create unique index if not exists dealers_account_number_unique
  on dealers (account_number) where account_number is not null;

alter table purchase_orders drop constraint if exists purchase_orders_status_check;
update purchase_orders set status = 'dealer_approved' where status = 'approved';
alter table purchase_orders add constraint purchase_orders_status_check
  check (status in (
    'submitted',
    'freight_quoted',
    'dealer_approved',
    'in_production',
    'quality_check',
    'shipped',
    'delivered',
    'cancelled'
  ));
alter table purchase_orders add column if not exists freight_cents integer;
alter table purchase_orders add column if not exists dealer_po_number text;
alter table purchase_orders add column if not exists job_name text;
alter table purchase_orders add column if not exists ship_to text;
alter table purchase_orders add column if not exists requested_ship_date date;
alter table purchase_orders add column if not exists estimated_ship_date date;
alter table purchase_orders add column if not exists carrier text;
alter table purchase_orders add column if not exists tracking_number text;
alter table purchase_orders add column if not exists bol_url text;
alter table purchase_orders add column if not exists acknowledgment_url text;
alter table purchase_orders add column if not exists invoice_url text;

alter table purchase_order_line_items add column if not exists finish text;
alter table purchase_order_line_items add column if not exists color text;
alter table purchase_order_line_items add column if not exists hearth text;

create table if not exists manufacturing_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_line_item_id uuid not null references purchase_order_line_items (id) on delete cascade,
  manufacturing_model text not null,
  manufacturing_finish text not null,
  manufacturing_color text,
  manufacturing_hearth text not null,
  created_at timestamptz not null default now()
);

alter table manufacturing_order_lines enable row level security;

drop policy if exists "dealers can insert own purchase orders" on purchase_orders;
create policy "dealers can insert own purchase orders"
  on purchase_orders for insert
  with check (
    dealer_id in (
      select id from dealers
      where user_id = auth.uid() and status = 'approved'
    )
  );

-- There is intentionally no dealer-facing policy on manufacturing_order_lines.
-- It is written and read only with the server-side service role.
