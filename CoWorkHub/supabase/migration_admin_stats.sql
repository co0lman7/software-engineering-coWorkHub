-- Migration: real admin dashboard data.
-- Adds an email column to profiles (for the admin Users table) and lets
-- admins read every profile/booking, not just their own.
-- Safe to run more than once. Run this in the Supabase SQL Editor.

alter table public.profiles add column if not exists email text;

-- Backfill email for users that already signed up before this column existed.
update public.profiles p set email = u.email
from auth.users u
where p.id = u.id and p.email is distinct from u.email;

-- Keep email populated automatically for future signups.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);
  return new;
end; $$;

-- Let admins see every profile (needed for the admin Users page).
drop policy if exists "admin read all profiles" on public.profiles;
create policy "admin read all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Let admins see every booking (needed for admin stats/booking management).
drop policy if exists "admin read all bookings" on public.bookings;
create policy "admin read all bookings" on public.bookings for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Security: the existing "own profile update" policy lets any signed-in user
-- update their own row with no column restriction, which means a regular user
-- could set role='admin' on themselves and unlock the two policies above.
-- This trigger silently reverts any role change unless the actor is already an admin.
create or replace function public.prevent_role_escalation() returns trigger language plpgsql security definer as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    new.role := old.role;
  end if;
  return new;
end; $$;
drop trigger if exists prevent_role_escalation on public.profiles;
create trigger prevent_role_escalation before update on public.profiles for each row execute procedure public.prevent_role_escalation();

-- Verify: every row should have a non-null email, and you should see both new policies listed.
select count(*) as total_profiles, count(email) as profiles_with_email from public.profiles;
select policyname, tablename from pg_policies where tablename in ('profiles','bookings') and policyname like 'admin read all%';

-- To view the admin dashboard, at least one profile needs role='admin'.
-- Uncomment and run with your own email to promote yourself (SQL Editor runs
-- as postgres, so the anti-escalation trigger above does not block this):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
