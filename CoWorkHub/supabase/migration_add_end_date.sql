-- Migration: support multi-day bookings by adding an end_date column.
-- Safe to run more than once. Run this in the Supabase SQL Editor.

alter table public.bookings add column if not exists end_date date;

-- Backfill any existing single-day rows so end_date is never null.
update public.bookings set end_date = date where end_date is null;

alter table public.bookings alter column end_date set not null;
