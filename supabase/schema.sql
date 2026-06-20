-- =====================================================================
-- Serowe Travel — database schema, RLS policies, storage
-- Run this once in the Supabase SQL Editor.
-- =====================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- profiles
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('admin','staff','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by policies: is the current user staff/admin?
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','staff','viewer')
  );
$$;

create or replace function public.can_write()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','staff')
  );
$$;

-- =====================================================================
-- packages
-- =====================================================================
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type text not null default 'custom'
    check (type in ('luxury','family','health','adventure','custom')),
  destination text not null default '',
  duration text,
  price numeric(12,2),
  price_currency text not null default 'BWP',
  description text,
  inclusions text[] default '{}',
  exclusions text[] default '{}',
  itinerary jsonb default '[]'::jsonb,
  featured_image text,
  gallery_images text[] default '{}',
  status text not null default 'draft'
    check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists packages_status_idx on public.packages(status);
create index if not exists packages_type_idx on public.packages(type);

create trigger packages_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- =====================================================================
-- enquiries
-- =====================================================================
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  package_interest uuid references public.packages(id) on delete set null,
  status text not null default 'new'
    check (status in ('new','in_progress','replied','closed')),
  assigned_to uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries(status);
create index if not exists enquiries_created_idx on public.enquiries(created_at desc);

create trigger enquiries_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

-- =====================================================================
-- site_settings (single row, admin-editable social links)
-- =====================================================================
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles      enable row level security;
alter table public.packages      enable row level security;
alter table public.enquiries     enable row level security;
alter table public.site_settings enable row level security;

-- profiles ----------------------------------------------------------
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: admin read all" on public.profiles
  for select using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: admin manage" on public.profiles
  for all using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- packages ----------------------------------------------------------
create policy "packages: public read published" on public.packages
  for select using (status = 'published' or public.is_staff());
create policy "packages: staff insert" on public.packages
  for insert with check (public.can_write());
create policy "packages: staff update" on public.packages
  for update using (public.can_write());
create policy "packages: staff delete" on public.packages
  for delete using (public.can_write());

-- enquiries ---------------------------------------------------------
create policy "enquiries: public insert" on public.enquiries
  for insert with check (true);
create policy "enquiries: staff read" on public.enquiries
  for select using (public.is_staff());
create policy "enquiries: staff update" on public.enquiries
  for update using (public.can_write());
create policy "enquiries: staff delete" on public.enquiries
  for delete using (public.can_write());

-- site_settings -----------------------------------------------------
create policy "settings: public read" on public.site_settings
  for select using (true);
create policy "settings: admin update" on public.site_settings
  for update using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =====================================================================
-- Storage bucket: package-images (public read, staff write)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('package-images', 'package-images', true)
on conflict (id) do nothing;

create policy "package-images: public read" on storage.objects
  for select using (bucket_id = 'package-images');
create policy "package-images: staff insert" on storage.objects
  for insert with check (bucket_id = 'package-images' and public.can_write());
create policy "package-images: staff update" on storage.objects
  for update using (bucket_id = 'package-images' and public.can_write());
create policy "package-images: staff delete" on storage.objects
  for delete using (bucket_id = 'package-images' and public.can_write());

-- =====================================================================
-- After running: create your first user in Authentication, then run:
--   update public.profiles set role = 'admin' where id = '<that-user-id>';
-- =====================================================================
