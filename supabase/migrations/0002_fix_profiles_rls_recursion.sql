-- =====================================================================
-- Fix: infinite recursion in profiles RLS policies
-- Run once in the Supabase SQL Editor. Idempotent.
--
-- The "admin read all" / "admin manage" policies referenced public.profiles
-- inside a policy ON public.profiles, which Postgres rejects with
-- "infinite recursion detected in policy for relation profiles".
-- That made every authenticated read of profiles fail, so getCurrentProfile()
-- returned null and admin-only screens (Images, Airlines, Settings) showed
-- the "no permission" message even for the admin user.
--
-- The fix moves the admin check into a SECURITY DEFINER function (which runs
-- without RLS, exactly like the existing is_staff()/can_write() helpers), so
-- the policy no longer self-references.
-- =====================================================================

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Recreate the recursive policies using the helper.
drop policy if exists "profiles: admin read all" on public.profiles;
create policy "profiles: admin read all" on public.profiles
  for select using (public.is_admin());

drop policy if exists "profiles: admin manage" on public.profiles;
create policy "profiles: admin manage" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());
