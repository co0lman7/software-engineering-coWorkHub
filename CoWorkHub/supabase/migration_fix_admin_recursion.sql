-- URGENT FIX: run this now — it repairs an "infinite recursion detected in
-- policy for relation profiles" error that is currently breaking workspace
-- listing, login/profile loading, and everything else site-wide.
--
-- Cause: the "admin read all profiles" policy checks admin status via a
-- subquery on the profiles table itself. Postgres re-applies profiles' RLS
-- policies to that subquery, which re-triggers the same policy, forever.
-- Because the workspaces table's admin policy also references profiles,
-- this recursion poisons ordinary workspace reads too.
--
-- Fix: move the admin check into a SECURITY DEFINER function. Such functions
-- run with the privileges of their owner (postgres, which bypasses RLS), so
-- the check no longer re-triggers profiles' own policies.
--
-- Safe to run more than once.

create or replace function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "admin read all profiles" on public.profiles;
create policy "admin read all profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "admin read all bookings" on public.bookings;
create policy "admin read all bookings" on public.bookings for select using (public.is_admin());

drop policy if exists "admin manage workspaces" on public.workspaces;
create policy "admin manage workspaces" on public.workspaces for all using (public.is_admin());

create or replace function public.prevent_role_escalation() returns trigger language plpgsql security definer as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end; $$;
drop trigger if exists prevent_role_escalation on public.profiles;
create trigger prevent_role_escalation before update on public.profiles for each row execute procedure public.prevent_role_escalation();

-- Verify: this should return a row (not an error).
select id, email, role from public.profiles where role = 'admin';
