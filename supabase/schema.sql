-- Verdant Plantation OS — Supabase schema
-- Run in the Supabase SQL editor. Mirrors src/lib/types.ts.
-- RLS is enabled; the policies below scope every row to its owner (auth.uid()).

create extension if not exists "pgcrypto";

create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  location text not null,
  region text,
  area_hectares numeric not null default 0,
  soil_type text,
  latitude double precision,
  longitude double precision,
  established_year int,
  notes text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Safe to re-run on an existing deployment that predates the photo column.
alter table farms add column if not exists photo_url text;

create table if not exists crops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  farm_id uuid references farms (id) on delete cascade,
  name text not null,
  variety text,
  stage text not null default 'planned',
  area_hectares numeric not null default 0,
  planted_date date,
  expected_harvest_date date,
  expected_yield_tons numeric default 0,
  health_score int default 80
);

create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  role text,
  phone text,
  daily_rate numeric not null default 0,
  joined_date date,
  status text not null default 'active'
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  worker_id uuid references workers (id) on delete cascade,
  date date not null,
  status text not null default 'present',
  hours numeric not null default 0
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  category text not null default 'other',
  quantity numeric not null default 0,
  unit text,
  reorder_level numeric not null default 0,
  unit_cost numeric not null default 0,
  supplier text
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null,
  category text not null,
  description text,
  amount numeric not null default 0,
  date date not null,
  farm_id uuid references farms (id) on delete set null
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  crop_name text not null,
  buyer text,
  destination text,
  quantity_tons numeric not null default 0,
  price_per_ton numeric not null default 0,
  date date not null,
  status text not null default 'pending'
);

create table if not exists yields (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  crop_name text not null,
  farm_id uuid references farms (id) on delete set null,
  harvest_date date,
  expected_tons numeric not null default 0,
  actual_tons numeric not null default 0
);

-- Storage bucket for farm photos / export documents (public read).
insert into storage.buckets (id, name, public)
values ('plantation-files', 'plantation-files', true)
on conflict (id) do update set public = true;

-- Storage policies: anyone can read; authenticated users manage only files
-- stored under a folder named after their own user id (`{auth.uid}/...`).
drop policy if exists "tf_files_read" on storage.objects;
create policy "tf_files_read" on storage.objects
  for select using (bucket_id = 'plantation-files');

drop policy if exists "tf_files_insert" on storage.objects;
create policy "tf_files_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'plantation-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "tf_files_update" on storage.objects;
create policy "tf_files_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'plantation-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "tf_files_delete" on storage.objects;
create policy "tf_files_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'plantation-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Row Level Security: each user only sees their own data.
do $$
declare t text;
begin
  foreach t in array array[
    'farms','crops','workers','attendance','inventory','transactions','sales','yields'
  ] loop
    execute format('alter table %I enable row level security;', t);
    -- Drop first so the script is safe to re-run.
    execute format('drop policy if exists "owner_all_%1$s" on %1$I;', t);
    execute format($f$
      create policy "owner_all_%1$s" on %1$I
      for all using (owner_id = auth.uid())
      with check (owner_id = auth.uid());
    $f$, t);
  end loop;
end $$;
