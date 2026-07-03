-- Example seed data. Edit the group names below to match your real groups,
-- then run this once. Groups have no UI for creation per the product spec —
-- this is the intended way to add/rename groups going forward.

insert into groups (name) values
  ('A6'), ('A7'), ('A9'), ('A10'), ('A12'),
  ('B1'), ('B2'), ('B3')
on conflict (name) do nothing;
