-- KINGBAGS — Supabase schema
-- Run once in the Supabase SQL editor (or via the Supabase connector).
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Schema
-- ---------------------------------------------------------------------------
create schema if not exists kingbags;

-- ---------------------------------------------------------------------------
-- 2. Quotes table
--    Shape mirrors saveQuote() in lib/supabase.ts.
-- ---------------------------------------------------------------------------
create table if not exists kingbags.quotes (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text        not null,
  company       text,
  product_slug  text        not null,
  product_name  text        not null,
  quantity      integer     not null check (quantity > 0),
  unit_price    numeric(10,4) not null check (unit_price >= 0),
  total_price   numeric(12,2) not null check (total_price >= 0),
  art_filename  text,
  notes         text
);

create index if not exists quotes_created_at_idx on kingbags.quotes (created_at desc);
create index if not exists quotes_email_idx      on kingbags.quotes (email);

-- ---------------------------------------------------------------------------
-- 3. Row level security
--    The anon key ships to the browser, so the public role gets insert only.
--    Nobody can read quotes back out with it — reads require the service role.
-- ---------------------------------------------------------------------------
alter table kingbags.quotes enable row level security;

drop policy if exists "anon can submit quotes" on kingbags.quotes;
create policy "anon can submit quotes"
  on kingbags.quotes
  for insert
  to anon
  with check (true);

grant usage on schema kingbags to anon;
grant insert on kingbags.quotes to anon;

-- ---------------------------------------------------------------------------
-- 4. Storage bucket for uploaded artwork
--    Private bucket: uploads allowed, listing and reads are not.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('kingbags-art', 'kingbags-art', false)
on conflict (id) do nothing;

drop policy if exists "anon can upload art" on storage.objects;
create policy "anon can upload art"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'kingbags-art');

-- ---------------------------------------------------------------------------
-- 5. Expose the kingbags schema to PostgREST
--    Without this, supabase-js calls against schema "kingbags" 404.
-- ---------------------------------------------------------------------------
alter role authenticator set pgrst.db_schemas = 'public, storage, graphql_public, kingbags';
notify pgrst, 'reload config';

-- ---------------------------------------------------------------------------
-- 6. Order platform (phase 1) — orders, order events, auth-scoped RLS.
--    Customers sign in with magic links; each sees only their own orders.
--    Status changes and event writes happen server-side only.
-- ---------------------------------------------------------------------------
do $$ begin
  create type kingbags.order_status as enum (
    'submitted',        -- customer finished the continue-flow
    'art_review',       -- art being checked (pre-flight + team/AI)
    'needs_changes',    -- art kicked back to the customer
    'art_approved',     -- proof approved by the customer
    'awaiting_payment', -- charge/invoice in flight
    'in_production',    -- PO sent, factory cutting and sewing
    'shipped'           -- freight on the way / delivered
  );
exception when duplicate_object then null; end $$;

create table if not exists kingbags.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  status        kingbags.order_status not null default 'submitted',
  product_slug  text not null,
  product_name  text not null,
  quantity      integer not null check (quantity > 0),
  unit_price    numeric(10,4) not null check (unit_price >= 0),
  total_price   numeric(12,2) not null check (total_price >= 0),
  art_filename  text,
  email         text not null,
  phone         text,
  company       text not null,
  ship_name     text not null,
  ship_address1 text not null,
  ship_address2 text,
  ship_city     text not null,
  ship_state    text not null,
  ship_postal   text not null,
  ship_country  text not null default 'US',
  billing_name  text,
  billing_email text,
  notes         text
);

create index if not exists orders_user_idx   on kingbags.orders (user_id, created_at desc);
create index if not exists orders_status_idx on kingbags.orders (status);

create table if not exists kingbags.order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references kingbags.orders (id) on delete cascade,
  created_at timestamptz not null default now(),
  event      text not null,
  status     kingbags.order_status,
  note       text,
  actor      text not null default 'system'  -- system | customer | team | ai
);

create index if not exists order_events_order_idx on kingbags.order_events (order_id, created_at);

create or replace function kingbags.touch_updated_at()
returns trigger language plpgsql set search_path = kingbags as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists orders_touch on kingbags.orders;
create trigger orders_touch before update on kingbags.orders
  for each row execute function kingbags.touch_updated_at();

-- Every insert and every status change gets a timeline event. SECURITY
-- DEFINER so customer inserts can log without write access to order_events.
create or replace function kingbags.log_order_event()
returns trigger language plpgsql security definer set search_path = kingbags as $$
begin
  if tg_op = 'INSERT' then
    insert into kingbags.order_events (order_id, event, status, actor)
    values (new.id, 'order_placed', new.status, 'customer');
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into kingbags.order_events (order_id, event, status, actor)
    values (new.id, 'status_changed', new.status, 'team');
  end if;
  return new;
end $$;

drop trigger if exists orders_log_event on kingbags.orders;
create trigger orders_log_event after insert or update on kingbags.orders
  for each row execute function kingbags.log_order_event();

alter table kingbags.orders enable row level security;
alter table kingbags.order_events enable row level security;

drop policy if exists "own orders: read" on kingbags.orders;
create policy "own orders: read" on kingbags.orders
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "own orders: create" on kingbags.orders;
create policy "own orders: create" on kingbags.orders
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "own order events: read" on kingbags.order_events;
create policy "own order events: read" on kingbags.order_events
  for select to authenticated using (
    exists (
      select 1 from kingbags.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

grant usage on schema kingbags to authenticated;
grant select, insert on kingbags.orders to authenticated;
grant select on kingbags.order_events to authenticated;

-- Signed-in customers can also upload artwork (revisions after kick-back).
drop policy if exists "authenticated can upload art" on storage.objects;
create policy "authenticated can upload art"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'kingbags-art');

-- Trigger functions are internal only: keep them off the REST RPC surface.
-- Triggers still fire — trigger EXECUTE checks the table owner, not the
-- request role.
revoke execute on function kingbags.touch_updated_at() from public, anon, authenticated;
revoke execute on function kingbags.log_order_event() from public, anon, authenticated;
