-- Support Teacher App — initial schema
-- Single-tenant: one teacher, enforced via Supabase Auth + RLS below.

create extension if not exists pgcrypto;

-- Groups
create table if not exists groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now()
);

-- Students
create table if not exists students (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  group_id    uuid not null references groups(id) on delete restrict,
  status      text not null default 'active' check (status in ('active','inactive')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_students_group on students(group_id);

-- Attendance — one row per student per date
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  date        date not null,
  status      text not null check (status in ('+','-','n/a')),
  updated_at  timestamptz not null default now(),
  unique (student_id, date)
);
create index if not exists idx_attendance_date on attendance(date);

-- Homework — one row per student per date
create table if not exists homework (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  date        date not null,
  score       smallint not null check (score between 0 and 100),
  updated_at  timestamptz not null default now(),
  unique (student_id, date)
);
create index if not exists idx_homework_date on homework(date);

-- Keep updated_at current on every write
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_attendance_updated_at on attendance;
create trigger trg_attendance_updated_at
  before update on attendance
  for each row execute function set_updated_at();

drop trigger if exists trg_homework_updated_at on homework;
create trigger trg_homework_updated_at
  before update on homework
  for each row execute function set_updated_at();

-- Row Level Security
-- Single teacher: any authenticated Supabase Auth user (there will only ever be one)
-- has full access. If a second teacher is ever added, tighten these policies to
-- check a teacher_id column instead of just auth.role().

alter table groups enable row level security;
alter table students enable row level security;
alter table attendance enable row level security;
alter table homework enable row level security;

create policy "public full access" on groups
  for all using (true) with check (true);

create policy "public full access" on students
  for all using (true) with check (true);

create policy "public full access" on attendance
  for all using (true) with check (true);

create policy "public full access" on homework
  for all using (true) with check (true);

