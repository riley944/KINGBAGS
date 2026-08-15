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
