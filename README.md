# Visionary Masters Global — Company Website

Next.js 14 (App Router) + TypeScript + TailwindCSS + Supabase. Multi-language (English, Hindi, Hinglish, Punjabi) public site with a login-protected admin CMS for the portfolio/work section.

## 1. Prerequisites

- Node.js 18.17+
- A free [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account (for deployment)

## 2. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**. Pick any name/region, free tier is fine.
2. Once the project is ready, go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret, server-only)
3. Go to **SQL Editor → New Query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:
   - The `portfolio_posts` table with row-level security (public read, authenticated-only write)
   - The `portfolio-images` and `portfolio-videos` storage buckets with matching policies

## 3. Create the first (and only) admin user

There is no public sign-up — the app only supports logging in.

1. In the Supabase dashboard, go to **Authentication → Users → Add User**.
2. Enter Vineet's email and a password, and check **Auto Confirm User**.
3. That's it — this is the only account that can log in at `/admin/login`.

(Alternatively: **Authentication → Providers** confirm "Email" is enabled, then use "Add User → Create new user".)

## 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values from step 2:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 5. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Admin CMS is at `http://localhost:3000/admin/login`.

## 6. Contact form

The public contact form posts directly to [FormSubmit.co](https://formsubmit.co) (no backend/API key needed) targeting `vineet.grover.1990@gmail.com`. **The first time a submission is sent, FormSubmit emails that inbox a one-time confirmation link — click it once to activate delivery for this site.** After that, all future submissions arrive by email automatically.

If you'd rather use a transactional email provider (Resend, SendGrid, etc.) instead of FormSubmit, swap the `fetch` call in [`components/ContactForm.tsx`](components/ContactForm.tsx) for an API route that calls your provider.

## 7. Adding portfolio images referenced by the Services page

Place these 8 files in `public/images/` (exact filenames, referenced directly in the Services section):

```
email-template-sample.png
powerbi-dashboard-sample.png
mis-report-sample.png
excel-tracker-sample.png
presentation-slide-sample.png
n8n-workflow-sample.png
video-generation-sample.png
ai-image-generation-sample.png
```

The "Simple Websites" service card has no sample image by design (icon only).

## 8. LinkedIn auto-post setup (optional)

When enabled, checking "Also post to LinkedIn" in the admin's Add/Edit Post form will share the post's photo (or text only, if there's no image) to your LinkedIn profile. **Video posts are never auto-shared** — LinkedIn's video upload API is a much heavier, multi-step process; share those to LinkedIn manually.

This requires you personally to create a LinkedIn Developer App and generate an access token — this is a one-time (well, once every ~60 days) manual step that only you can do, since it needs your LinkedIn login:

1. Go to [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps) → **Create App**. Fill in the required fields (you'll need to associate it with a LinkedIn Company Page — you can create a minimal one for Visionary Masters Global if you don't have one already).
2. On your app's **Products** tab, request/add:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn**
   (Both are self-serve for your own app/account — no LinkedIn review needed to post as yourself.)
3. Go to [linkedin.com/developers/tools/oauth](https://www.linkedin.com/developers/tools/oauth) (OAuth 2.0 Tools), select your app, and generate an access token with scopes `openid`, `profile`, and `w_member_social`. You'll be asked to log in and consent — this produces a token valid for ~60 days.
4. Get your person URN: call `GET https://api.linkedin.com/v2/userinfo` with header `Authorization: Bearer <your-token>` (e.g. via Postman, or `curl`). The response's `"sub"` field is your member ID — your URN is `urn:li:person:<sub>`.
5. Add both values as environment variables:
   ```
   LINKEDIN_ACCESS_TOKEN=<token from step 3>
   LINKEDIN_PERSON_URN=urn:li:person:<sub from step 4>
   ```
6. **Every ~60 days**, the token expires — repeat step 3 and update the env var (and redeploy on Vercel) to keep auto-posting working.

If these variables aren't set, the checkbox in the admin form will simply show a clear error when used — nothing else on the site is affected.

## 8b. Pages at a glance

| Page | Route | In the menu? | Managed from |
|---|---|---|---|
| Home | `/` | Yes | Slides + updates banner from the admin |
| About Us | `/about` | Yes | Translation files |
| Services & Work | `/services` | Yes | Services from translation files; "Our Work" posts from the admin |
| Gallery | `/gallery` | Yes | Admin → Gallery |
| Contact Us | `/contact` | Yes | Static details + FormSubmit |
| Our Clients | `/clients` | **No — unlisted** | Admin → Our Clients |

"Our Work" used to be its own page; it now lives as a section on `/services`, and `/portfolio` redirects there so old links keep working.

`/clients` is deliberately **not linked anywhere and excluded from search** (noindex + robots.txt). Add clients to it as they come in; when you're ready to show it publicly, add it to the `navItems` list in [`components/Header.tsx`](components/Header.tsx) and remove it from [`app/robots.ts`](app/robots.ts) and [`app/clients/layout.tsx`](app/clients/layout.tsx).

## 9. "What's New" banner (daily updates & tips)

The home page shows a rotating banner sourced from the `site_updates` table (created by `supabase/schema.sql`). Manage it from **Admin Dashboard → Daily Updates & Tips**: add a short message, tag it as an "Update" or a "Tip", and it appears in the homepage banner immediately. Toggle an item to "Hidden" to pull it from the banner without deleting it.

## 10. Home page slides (Claude / ChatGPT / LinkedIn / News)

The hero shows a continuously sliding strip of content cards, managed from **Admin Dashboard → Home Page Slides**. Each slide has a type, and each type gets its own colour and icon:

| Type | Use it for | Colour |
|---|---|---|
| Claude | Claude tips & skills | Orange |
| ChatGPT | ChatGPT tips & skills | Green |
| LinkedIn | A LinkedIn post | Blue |
| News | News / announcements | Gold |

Each slide takes a title, a short description, an optional image, and an optional link (clicking the card opens it). Toggle a slide to "Hidden" to pull it from the strip without deleting it. The strip pauses when a visitor hovers over it.

## 11. Floating WhatsApp button

Every page has a floating green WhatsApp button. Clicking it opens a WhatsApp chat to +974-71913089; **dragging it moves it anywhere on screen**, and its position is remembered per visitor (`localStorage`). To change the number, edit `WHATSAPP_NUMBER` in [`components/FloatingWhatsApp.tsx`](components/FloatingWhatsApp.tsx) (and in `Footer.tsx` / `app/contact/page.tsx`).

## 12. Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **New Project → Import** the repo.
3. Add the environment variables from step 4 (and, if using it, step 8's LinkedIn variables) in **Project Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra build config needed.

## Project structure

```
app/                    Pages (App Router)
  about/                About Us
  services/             Services (8 cards, expandable detail)
  portfolio/            Our Work (reads from Supabase)
  contact/              Contact form + details
  admin/login/          Admin login (Supabase Auth)
  admin/dashboard/      Admin CMS — portfolio posts, home slides, "What's New" banner
  api/linkedin/post/    Auth-gated route that shares a post to LinkedIn
components/             Shared UI (Header, Footer, cards, forms, HomeSlides, UpdatesBanner, FloatingWhatsApp)
lib/i18n/               Language context + translation loader
lib/supabase/           Browser/server Supabase clients, auth middleware, upload helper
lib/linkedin.ts         LinkedIn image-upload + post-creation helper
locales/                en.json, hi.json, hinglish.json, pa.json
supabase/schema.sql     Database + storage schema to run in Supabase (portfolio_posts, site_updates, home_slides)
middleware.ts           Protects /admin/* routes, redirects unauthenticated users
```

## Notes

- Language choice is stored in `localStorage` and defaults to English on first visit.
- All public-facing static copy is pulled from the four JSON files in `locales/` — nothing is hardcoded in components/pages other than admin-only UI (which is English-only, since it's used by a single internal admin).
- Video uploads use the Supabase Storage REST API directly via `XMLHttpRequest` so real upload progress can be shown (the JS client's `upload()` doesn't expose progress events).
