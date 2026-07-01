
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  email       text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user','admin')),
  created_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- security definer bypasses RLS internally, so admin-check policies (on this
-- table or others) don't recursively re-trigger profiles' own RLS policies.
create or replace function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "admin read all profiles" on public.profiles for select using (public.is_admin());
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Prevent non-admins from granting themselves the admin role via a profile update.
create or replace function public.prevent_role_escalation() returns trigger language plpgsql security definer as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end; $$;
drop trigger if exists prevent_role_escalation on public.profiles;
create trigger prevent_role_escalation before update on public.profiles for each row execute procedure public.prevent_role_escalation();

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(), name text not null, location text not null,
  description text not null default '', price_per_day numeric(10,2) not null,
  capacity int not null, rating numeric(3,2) not null default 0, reviews int not null default 0,
  type text not null check (type in ('desk','meeting-room','private-office','coworking')),
  image text not null default '', images text[] not null default '{}',
  amenities text[] not null default '{}', available boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.workspaces enable row level security;
create policy "workspaces public read" on public.workspaces for select using (true);
create policy "admin manage workspaces" on public.workspaces for all using (public.is_admin());

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  date date not null, end_date date not null, start_time time not null, end_time time not null,
  seats int not null default 1, total_price numeric(10,2) not null,
  status text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "own bookings select" on public.bookings for select using (auth.uid()=user_id);
create policy "admin read all bookings" on public.bookings for select using (public.is_admin());
create policy "own bookings insert" on public.bookings for insert with check (auth.uid()=user_id);
create policy "own bookings update" on public.bookings for update using (auth.uid()=user_id);

insert into public.workspaces (name,location,description,price_per_day,capacity,rating,reviews,type,image,images,amenities) values
('Downtown Tech Hub','San Francisco, CA','Modern coworking space in the heart of downtown.',45,50,4.8,127,'coworking','https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1080',ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1080'],ARRAY['High-Speed WiFi','Coffee & Tea','Phone Booths','24/7 Access']),
('Executive Meeting Room','New York, NY','Professional meeting room with video conferencing.',120,12,4.9,89,'meeting-room','https://images.unsplash.com/photo-1628062699790-7c45262b82b4?w=1080',ARRAY['https://images.unsplash.com/photo-1628062699790-7c45262b82b4?w=1080'],ARRAY['Video Conferencing','Whiteboard','Projector','WiFi']),
('Creative Studio Office','Austin, TX','Bright workspace for creative teams.',75,8,4.7,64,'private-office','https://images.unsplash.com/photo-1715593949273-09009558300a?w=1080',ARRAY['https://images.unsplash.com/photo-1715593949273-09009558300a?w=1080'],ARRAY['Private Space','WiFi','Kitchen','Parking']),
('Minimalist Desk Space','Seattle, WA','Clean dedicated desk in a quiet environment.',35,1,4.6,52,'desk','https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1080',ARRAY['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1080'],ARRAY['Dedicated Desk','WiFi','Coffee & Tea','Locker']),
('Startup Innovation Lab','Boston, MA','Dynamic workspace for growing startups.',55,30,4.8,98,'coworking','https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1080',ARRAY['https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1080'],ARRAY['WiFi','Event Space','Kitchen','Showers']),
('Luxury Private Suite','Los Angeles, CA','Premium private office with stunning city views.',150,6,5.0,45,'private-office','https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1080',ARRAY['https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1080'],ARRAY['Private Suite','Concierge','City Views','Parking']);
