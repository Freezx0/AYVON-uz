create table if not exists public.ayvon_bookings (
  id text primary key,
  studio_id text not null,
  studio_name text not null,
  city text not null,
  slot text not null,
  seats integer not null,
  duration integer not null,
  total bigint not null,
  guest text not null,
  brief text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  created_at_label text not null
);

create index if not exists ayvon_bookings_created_at_idx
  on public.ayvon_bookings (created_at desc);

create table if not exists public.ayvon_waitlist (
  id text primary key,
  name text not null,
  email text not null,
  goal text not null,
  city text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  created_at_label text not null
);

create index if not exists ayvon_waitlist_created_at_idx
  on public.ayvon_waitlist (created_at desc);
