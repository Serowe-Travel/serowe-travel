-- =====================================================================
-- Migration: editable site imagery + airlines carousel
-- Run this once in the Supabase SQL Editor on the existing project.
-- Idempotent — safe to re-run. Reuses the existing `package-images`
-- storage bucket, so no new bucket/storage policies are required.
-- =====================================================================

-- ---------- site_images ----------
create table if not exists public.site_images (
  slot text primary key,
  url text not null,
  alt text,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_images_updated_at on public.site_images;
create trigger site_images_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

alter table public.site_images enable row level security;

drop policy if exists "site_images: public read" on public.site_images;
create policy "site_images: public read" on public.site_images
  for select using (true);

drop policy if exists "site_images: staff write" on public.site_images;
create policy "site_images: staff write" on public.site_images
  for all using (public.can_write()) with check (public.can_write());

-- ---------- airlines ----------
create table if not exists public.airlines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  link_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists airlines_sort_idx
  on public.airlines(sort_order, created_at);

drop trigger if exists airlines_updated_at on public.airlines;
create trigger airlines_updated_at
  before update on public.airlines
  for each row execute function public.set_updated_at();

alter table public.airlines enable row level security;

drop policy if exists "airlines: public read active" on public.airlines;
create policy "airlines: public read active" on public.airlines
  for select using (is_active or public.is_staff());

drop policy if exists "airlines: staff write" on public.airlines;
create policy "airlines: staff write" on public.airlines
  for all using (public.can_write()) with check (public.can_write());
