-- ============================================================================
--  «Слово» — схема базы данных для Supabase
--  Выполнить целиком в Supabase → SQL Editor → New query → Run.
--  Идемпотентно: можно запускать повторно.
-- ============================================================================

-- ---------- Таблицы ----------

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Участник',
  avatar_url   text,
  bio          text,
  onboarded    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.invite_codes (
  code       text primary key,
  note       text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  key          text primary key,
  title        text not null,
  choice_label text not null,
  sort         int  not null default 0
);

create table if not exists public.choices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  challenge_key text not null references public.challenges(key),
  choice_value  text not null default '',
  goal          text not null default '',
  updated_at    timestamptz not null default now(),
  unique (user_id, challenge_key)
);

create table if not exists public.checkins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  challenge_key text not null references public.challenges(key),
  day           date not null default current_date,
  created_at    timestamptz not null default now(),
  unique (user_id, challenge_key, day)
);

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  challenge_key text references public.challenges(key),
  body          text not null default '',
  image_url     text,
  created_at    timestamptz not null default now()
);

-- ---------- Справочник трёх пари ----------

insert into public.challenges (key, title, choice_label, sort) values
  ('country', 'Страна',      'Какую страну выбираешь?',        1),
  ('craft',   'Творчество',  'Какой вид творчества?',          2),
  ('flaw',    'Недостаток',  'С каким недостатком воюешь?',     3)
on conflict (key) do nothing;

-- ---------- Автосоздание профиля при регистрации ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Участник'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Проверка инвайт-кода (коды наружу не отдаём) ----------

create or replace function public.redeem_invite(code text)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.invite_codes i
    where i.code = redeem_invite.code and i.active
  );
$$;

grant execute on function public.redeem_invite(text) to anon, authenticated;

-- ---------- Row Level Security ----------

alter table public.profiles     enable row level security;
alter table public.invite_codes enable row level security;
alter table public.challenges   enable row level security;
alter table public.choices      enable row level security;
alter table public.checkins     enable row level security;
alter table public.posts        enable row level security;

-- challenges: читают все вошедшие
drop policy if exists challenges_read on public.challenges;
create policy challenges_read on public.challenges
  for select to authenticated using (true);

-- invite_codes: напрямую недоступны никому (только через redeem_invite)

-- Хелпер-макрос políticas: группа видит всё про всех, менять можно только своё.

-- profiles
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select to authenticated using (true);
drop policy if exists profiles_write_own on public.profiles;
create policy profiles_write_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- choices
drop policy if exists choices_read on public.choices;
create policy choices_read on public.choices
  for select to authenticated using (true);
drop policy if exists choices_insert_own on public.choices;
create policy choices_insert_own on public.choices
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists choices_update_own on public.choices;
create policy choices_update_own on public.choices
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- checkins
drop policy if exists checkins_read on public.checkins;
create policy checkins_read on public.checkins
  for select to authenticated using (true);
drop policy if exists checkins_insert_own on public.checkins;
create policy checkins_insert_own on public.checkins
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists checkins_delete_own on public.checkins;
create policy checkins_delete_own on public.checkins
  for delete to authenticated using (user_id = auth.uid());

-- posts
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts
  for select to authenticated using (true);
drop policy if exists posts_insert_own on public.posts;
create policy posts_insert_own on public.posts
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists posts_delete_own on public.posts;
create policy posts_delete_own on public.posts
  for delete to authenticated using (user_id = auth.uid());

-- ---------- Пример: добавить инвайт-код группы ----------
--   (замените на свой; раздайте его участникам)
insert into public.invite_codes (code, note) values ('SLOVO-2026', 'основная группа')
on conflict (code) do nothing;

-- ============================================================================
--  Storage: в разделе Storage создайте два ПУБЛИЧНЫХ бакета:
--    avatars       — для аватаров
--    post-images   — для фото к отчётам
--  Затем добавьте политики загрузки (Storage → Policies) для роли authenticated:
--    INSERT: bucket_id in ('avatars','post-images')
--  Чтение публичное, т.к. бакеты public.
-- ============================================================================
