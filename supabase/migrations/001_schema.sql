-- =====================================================================
-- Niche Perfume India — database schema (Supabase / Postgres)
-- Run in: Supabase Dashboard > SQL Editor > New query > paste > Run.
-- Safe to run more than once.
-- =====================================================================

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Is the logged-in user an admin?  (security definer so RLS policies can call it)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- Catalogue ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  inspired_by text not null default '',
  gender text not null default 'Unisex' check (gender in ('Men','Women','Unisex')),
  description text not null default '',
  notes text[] not null default '{}',
  image_url text not null default '/images/bottle-generic.svg',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('sample','decant','partial','retail')),
  size_ml int not null check (size_ml > 0),
  price int not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  unique (product_id, type, size_ml)
);
create index if not exists variants_product_idx on public.product_variants(product_id);

-- ---------- Orders (written only by the server via create_order()) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status text not null default 'new' check (status in ('new','confirmed','shipped','delivered','cancelled')),
  customer_name text not null,
  phone text not null,
  email text not null default '',
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  notes text not null default '',
  payment_method text not null default 'cod',
  subtotal int not null default 0,
  shipping int not null default 0,
  cod_fee int not null default 0,
  total int not null default 0,
  admin_notes text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  brand text not null,
  label text not null,
  qty int not null check (qty > 0),
  price int not null
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------- Site content ----------
create table if not exists public.settings (key text primary key, value text not null default '');
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0
);
create table if not exists public.content_pages (slug text primary key, title text not null, body text not null default '');

-- ---------- Inbox ----------
create table if not exists public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new','contacted','done')),
  name text not null, phone text not null, email text not null default '',
  brand text not null default '', fragrance text not null default '', size_ml int not null default 0,
  fill_level text not null default '', batch_code text not null default '', expected_price text not null default '',
  details text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new','done')),
  name text not null, phone text not null, email text not null default '',
  subject text not null default '', message text not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security: the public can READ the catalogue/content only.
-- Only admins can change anything. Orders/enquiries are inserted by the
-- server (service role key), so the public has NO direct write access.
-- =====================================================================
alter table public.admin_users      enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.settings         enable row level security;
alter table public.faqs             enable row level security;
alter table public.content_pages    enable row level security;
alter table public.sell_requests    enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare t text;
begin
  -- admin full access on every table
  foreach t in array array['products','product_variants','orders','order_items','settings','faqs','content_pages','sell_requests','contact_messages'] loop
    execute format('drop policy if exists "admin all" on public.%I', t);
    execute format('create policy "admin all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
  -- public read on storefront tables
  foreach t in array array['settings','faqs','content_pages'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists "public read active" on public.products;
create policy "public read active" on public.products for select to anon, authenticated using (is_active);
drop policy if exists "public read active" on public.product_variants;
create policy "public read active" on public.product_variants for select to anon, authenticated using (is_active);

drop policy if exists "read own admin row" on public.admin_users;
create policy "read own admin row" on public.admin_users for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- =====================================================================
-- create_order(): atomic, server-side pricing + stock check.
-- Only callable with the service role key (i.e. from our /api/orders route).
-- =====================================================================
create or replace function public.create_order(
  p_customer jsonb, p_items jsonb, p_free_threshold int, p_shipping_fee int, p_cod_fee int
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_number text; v_sub int := 0; v_ship int; v_cod int; v_total int;
  it jsonb; r record; v_qty int; v_lines jsonb := '[]'::jsonb; v_label text;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'NOT_FOUND';
  end if;

  v_number := 'NPI-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-' ||
              upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
  v_cod := case when p_customer->>'payment_method' = 'cod' then greatest(0, coalesce(p_cod_fee, 0)) else 0 end;

  insert into orders (order_number, customer_name, phone, email, address, city, state, pincode, notes, payment_method)
  values (v_number, p_customer->>'customer_name', p_customer->>'phone', coalesce(p_customer->>'email',''),
          p_customer->>'address', p_customer->>'city', p_customer->>'state', p_customer->>'pincode',
          coalesce(p_customer->>'notes',''), coalesce(p_customer->>'payment_method','cod'))
  returning id into v_id;

  for it in select * from jsonb_array_elements(p_items) loop
    v_qty := greatest(1, least(20, coalesce((it->>'qty')::int, 1)));
    begin
      select pv.id as vid, pv.type, pv.size_ml, pv.price, pv.stock, p.name, p.brand
        into r
        from product_variants pv join products p on p.id = pv.product_id
       where pv.id = (it->>'variant_id')::uuid and pv.is_active and p.is_active
       for update of pv;
    exception when invalid_text_representation then
      raise exception 'NOT_FOUND';
    end;
    if not found then raise exception 'NOT_FOUND'; end if;
    if r.stock < v_qty then raise exception 'OUT_OF_STOCK:%', r.name; end if;

    update product_variants set stock = stock - v_qty where id = r.vid;
    v_label := initcap(case r.type when 'retail' then 'retail pack' else r.type end) || ' ' || r.size_ml || 'ml';
    insert into order_items (order_id, variant_id, product_name, brand, label, qty, price)
    values (v_id, r.vid, r.name, r.brand, v_label, v_qty, r.price);
    v_sub := v_sub + r.price * v_qty;
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'name', r.name, 'brand', r.brand, 'label', v_label, 'qty', v_qty, 'price', r.price));
  end loop;

  v_ship := case when p_free_threshold > 0 and v_sub >= p_free_threshold then 0 else greatest(0, coalesce(p_shipping_fee, 0)) end;
  v_total := v_sub + v_ship + v_cod;
  update orders set subtotal = v_sub, shipping = v_ship, cod_fee = v_cod, total = v_total where id = v_id;

  return jsonb_build_object(
    'order_number', v_number,
    'customer_name', p_customer->>'customer_name', 'phone', p_customer->>'phone',
    'address', p_customer->>'address', 'city', p_customer->>'city', 'state', p_customer->>'state',
    'pincode', p_customer->>'pincode', 'payment_method', coalesce(p_customer->>'payment_method','cod'),
    'subtotal', v_sub, 'shipping', v_ship, 'total', v_total, 'items', v_lines);
end $$;

revoke all on function public.create_order(jsonb, jsonb, int, int, int) from public, anon, authenticated;
grant execute on function public.create_order(jsonb, jsonb, int, int, int) to service_role;

-- =====================================================================
-- Storage bucket for product images (public read, admin write)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "product images admin write" on storage.objects;
create policy "product images admin write" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
