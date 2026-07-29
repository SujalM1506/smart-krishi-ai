-- Run this SQL in your Supabase SQL Editor to create the farmer profiles table

create table if not exists public.farmer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  village text not null,
  district text not null,
  state text not null,
  pincode text not null,
  land_area text not null,
  primary_crop text not null,
  farming_experience text,
  preferred_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.farmer_profiles enable row level security;

create policy "Users can read own profile"
  on public.farmer_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.farmer_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.farmer_profiles for update
  using (auth.uid() = id);
