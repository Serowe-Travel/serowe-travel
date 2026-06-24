-- =====================================================================
-- Add a short description to airlines (shown on the public carousel).
-- Run once in the Supabase SQL Editor. Idempotent.
-- =====================================================================

alter table public.airlines
  add column if not exists description text;
