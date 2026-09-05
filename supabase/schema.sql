-- Visionary Masters Global — website schema.
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New Query).
--
-- IMPORTANT: every write policy is gated on the site_admins allowlist rather than
-- on "any authenticated user". That matters when the Supabase project's auth pool
-- is shared with another app (as it is today with Masters Academy) — without the
-- allowlist, any user of that other app could sign in and edit this website.

-- 0. Admin allowlist -------------------------------------------------------
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

comment on table public.site_admins is
  'Allowlist of users who may manage Visionary Masters Global website content. Membership here — never mere authentication — is the source of truth for website admin access.';

alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

drop policy if exists "Site admins can see their own allowlist row" on public.site_admins;
create policy "Site admins can see their own allowlist row"
  on public.site_admins for select
  to authenticated
  using (user_id = auth.uid());

-- Grant yourself access (replace the email if a different account should own it):
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'vineet.grover.1990@gmail.com'
-- on conflict (user_id) do nothing;

-- 1. Portfolio / work posts ------------------------------------------------
create table if not exists public.portfolio_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  image_url text,
  video_url text,
  created_at timestamptz not null default now()
);

alter table public.portfolio_posts enable row level security;

drop policy if exists "Public can read portfolio posts" on public.portfolio_posts;
create policy "Public can read portfolio posts"
  on public.portfolio_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Site admins can insert portfolio posts" on public.portfolio_posts;
create policy "Site admins can insert portfolio posts"
  on public.portfolio_posts for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update portfolio posts" on public.portfolio_posts;
create policy "Site admins can update portfolio posts"
  on public.portfolio_posts for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete portfolio posts" on public.portfolio_posts;
create policy "Site admins can delete portfolio posts"
  on public.portfolio_posts for delete
  to authenticated
  using (public.is_site_admin());

-- 2. "What's New" ticker (daily updates & tips) ----------------------------
create table if not exists public.site_updates (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  message_hi text,
  message_hinglish text,
  message_pa text,
  kind text not null default 'update' check (kind in ('update', 'tip')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Translations (safe to re-run on an existing table). `message` is the English
-- original and the fallback whenever a translation is left blank.
alter table public.site_updates add column if not exists message_hi text;
alter table public.site_updates add column if not exists message_hinglish text;
alter table public.site_updates add column if not exists message_pa text;

alter table public.site_updates enable row level security;

drop policy if exists "Public can read active site updates" on public.site_updates;
create policy "Public can read active site updates"
  on public.site_updates for select
  to anon, authenticated
  using (is_active = true or public.is_site_admin());

drop policy if exists "Site admins can insert site updates" on public.site_updates;
create policy "Site admins can insert site updates"
  on public.site_updates for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update site updates" on public.site_updates;
create policy "Site admins can update site updates"
  on public.site_updates for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete site updates" on public.site_updates;
create policy "Site admins can delete site updates"
  on public.site_updates for delete
  to authenticated
  using (public.is_site_admin());

-- 3. Home page slides (Claude / ChatGPT / LinkedIn / news) -----------------
create table if not exists public.home_slides (
  id uuid primary key default gen_random_uuid(),
  topic text not null default 'news' check (topic in ('claude', 'chatgpt', 'linkedin', 'news')),
  title text not null,
  title_hi text,
  title_hinglish text,
  title_pa text,
  body text,
  body_hi text,
  body_hinglish text,
  body_pa text,
  image_url text,
  link_url text,
  image_only boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Translations (safe to re-run on an existing table). `title`/`body` hold the
-- English original and are the fallback when a translation is left blank.
alter table public.home_slides add column if not exists title_hi text;
alter table public.home_slides add column if not exists title_hinglish text;
alter table public.home_slides add column if not exists title_pa text;
alter table public.home_slides add column if not exists body_hi text;
alter table public.home_slides add column if not exists body_hinglish text;
alter table public.home_slides add column if not exists body_pa text;
-- Screenshot mode: show only the image (e.g. a Claude/ChatGPT/LinkedIn
-- screenshot) with no title/description text overlaid on the card.
alter table public.home_slides add column if not exists image_only boolean not null default false;

-- Per-slide presentation options set from the admin.
-- image_fit: 'contain' shows the whole image (nothing cropped), 'cover' fills
-- the card and crops the overflow.
alter table public.home_slides add column if not exists image_fit text not null default 'contain';
alter table public.home_slides add column if not exists title_size text not null default 'medium';
alter table public.home_slides add column if not exists title_font text not null default 'sans';
alter table public.home_slides add column if not exists body_size text not null default 'medium';
alter table public.home_slides add column if not exists body_font text not null default 'sans';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'home_slides_image_fit_check') then
    alter table public.home_slides
      add constraint home_slides_image_fit_check check (image_fit in ('contain', 'cover'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'home_slides_title_size_check') then
    alter table public.home_slides
      add constraint home_slides_title_size_check check (title_size in ('small', 'medium', 'large'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'home_slides_body_size_check') then
    alter table public.home_slides
      add constraint home_slides_body_size_check check (body_size in ('small', 'medium', 'large'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'home_slides_title_font_check') then
    alter table public.home_slides
      add constraint home_slides_title_font_check check (title_font in ('sans', 'serif', 'mono'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'home_slides_body_font_check') then
    alter table public.home_slides
      add constraint home_slides_body_font_check check (body_font in ('sans', 'serif', 'mono'));
  end if;
end $$;

alter table public.home_slides enable row level security;

drop policy if exists "Public can read active home slides" on public.home_slides;
create policy "Public can read active home slides"
  on public.home_slides for select
  to anon, authenticated
  using (is_active = true or public.is_site_admin());

drop policy if exists "Site admins can insert home slides" on public.home_slides;
create policy "Site admins can insert home slides"
  on public.home_slides for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update home slides" on public.home_slides;
create policy "Site admins can update home slides"
  on public.home_slides for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete home slides" on public.home_slides;
create policy "Site admins can delete home slides"
  on public.home_slides for delete
  to authenticated
  using (public.is_site_admin());

-- 4. Gallery images --------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

drop policy if exists "Public can read active gallery images" on public.gallery_images;
create policy "Public can read active gallery images"
  on public.gallery_images for select
  to anon, authenticated
  using (is_active = true or public.is_site_admin());

drop policy if exists "Site admins can insert gallery images" on public.gallery_images;
create policy "Site admins can insert gallery images"
  on public.gallery_images for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update gallery images" on public.gallery_images;
create policy "Site admins can update gallery images"
  on public.gallery_images for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete gallery images" on public.gallery_images;
create policy "Site admins can delete gallery images"
  on public.gallery_images for delete
  to authenticated
  using (public.is_site_admin());

-- 5. Clients (logo wall — page is unlisted until you decide to link it) -----
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;

drop policy if exists "Public can read active clients" on public.clients;
create policy "Public can read active clients"
  on public.clients for select
  to anon, authenticated
  using (is_active = true or public.is_site_admin());

drop policy if exists "Site admins can insert clients" on public.clients;
create policy "Site admins can insert clients"
  on public.clients for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update clients" on public.clients;
create policy "Site admins can update clients"
  on public.clients for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete clients" on public.clients;
create policy "Site admins can delete clients"
  on public.clients for delete
  to authenticated
  using (public.is_site_admin());

-- 6. Service card watermark images -----------------------------------------
-- One optional image per service card. service_id matches the `id` of the
-- entries in locales/*.json -> services.items (e.g. 'powerbi-dashboards').
create table if not exists public.service_images (
  service_id text primary key,
  image_url text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.service_images enable row level security;

drop policy if exists "Public can read active service images" on public.service_images;
create policy "Public can read active service images"
  on public.service_images for select
  to anon, authenticated
  using (is_active = true or public.is_site_admin());

drop policy if exists "Site admins can insert service images" on public.service_images;
create policy "Site admins can insert service images"
  on public.service_images for insert
  to authenticated
  with check (public.is_site_admin());

drop policy if exists "Site admins can update service images" on public.service_images;
create policy "Site admins can update service images"
  on public.service_images for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

drop policy if exists "Site admins can delete service images" on public.service_images;
create policy "Site admins can delete service images"
  on public.service_images for delete
  to authenticated
  using (public.is_site_admin());

-- 7. Storage buckets (public read, admin-only writes) ----------------------
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-videos', 'portfolio-videos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view VMG website media" on storage.objects;
create policy "Public can view VMG website media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-videos'));

drop policy if exists "Site admins can upload VMG website media" on storage.objects;
create policy "Site admins can upload VMG website media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_site_admin());

drop policy if exists "Site admins can update VMG website media" on storage.objects;
create policy "Site admins can update VMG website media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_site_admin())
  with check (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_site_admin());

drop policy if exists "Site admins can delete VMG website media" on storage.objects;
create policy "Site admins can delete VMG website media"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_site_admin());
