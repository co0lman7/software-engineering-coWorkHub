-- supabase/migration_admin_update_bookings.sql
create policy "admin update bookings" on public.bookings for update using (public.is_admin());