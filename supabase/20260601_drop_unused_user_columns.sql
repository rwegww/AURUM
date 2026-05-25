alter table public.users
  drop column if exists arena_avatar;

alter table public.users
  add column if not exists current_session_id text;
