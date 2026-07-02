# Serowe Travel — Website & Staff Portal

Luxury & sustainable travel website for **Serowe Travel** (Botswana), with a
public marketing site and a staff back-office for managing travel packages and
enquiries.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Supabase**, deployed on **Vercel**.

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables (`.env.local`)

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key (server only — never expose) |
| `CONTACT_EMAIL` | Email enquiries are sent to (default `info@serowetravel.com`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://serowetravel.com`) |

The site runs without Supabase keys (packages stay hidden, enquiries fall back
to email-only), but the staff portal needs them.

---

## 2. Supabase setup (one time)

1. In the Supabase dashboard open **SQL Editor** and run the contents of
   [`supabase/schema.sql`](supabase/schema.sql). This creates all tables,
   row-level-security policies, the `package-images` storage bucket, and a
   single-row `site_settings` record.
2. Go to **Authentication → Users → Add user**, create the first staff account
   (email + password). Email confirmation can be disabled under
   **Authentication → Providers → Email** for internal staff.
3. Make that user an **admin** — run in SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'YOUR_EMAIL');
   ```
4. Roles: `admin` (full access incl. settings), `staff` (manage packages &
   enquiries), `viewer` (read-only).

---

## 3. Enquiries / email

The contact form (a Next.js **server action**) does two things:

1. Saves the enquiry to the `enquiries` table → visible in **Admin → Enquiries**.
2. Emails `CONTACT_EMAIL` via **FormSubmit.co** (no API key needed).

> ⚠️ **First-time activation:** FormSubmit requires you to confirm the address
> once. Submit the live contact form a single time, then click the activation
> link FormSubmit emails to `info@serowetravel.com`. After that, all enquiries
> are delivered automatically.

---

## 4. Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add the same environment variables (section 1) in **Vercel → Settings →
   Environment Variables**.
4. Add the custom domain **serowetravel.com** in **Vercel → Settings →
   Domains** and update DNS as Vercel instructs.
5. In Supabase → **Authentication → URL Configuration**, set the Site URL to
   your production domain.

---

## 5. Managing content

- **Admin portal:** `/login` → `/admin`
- **Add a package:** Admin → Packages → New Package. Upload a featured image and
  gallery images, fill in itinerary/inclusions, set **Status = Published** and
  (optionally) **Feature on homepage**.
- Published packages appear automatically on `/packages` and the homepage. When
  there are none, those sections hide themselves gracefully.
- **Social links:** Admin → Settings (admin role only). These drive the footer
  icons.

---

## 6. Project structure

```
app/
  (site)/            Public website (Header + Footer layout)
  (admin)/           Staff portal (auth-protected layout)
  login/             Staff sign-in
  sitemap.ts, robots.ts
components/site/      Public UI (Hero, Header, Footer, PackageCard, ContactForm…)
components/admin/     Admin UI (Sidebar, PackageForm, EnquiryCard, ImageUploader…)
components/ui/        Primitives (Button, Container, Reveal, SectionHeading)
lib/                 site content, Supabase clients, queries, types, validators
supabase/schema.sql  Database schema + RLS + storage
public/images/       Brand logo, hero & gallery imagery
proxy.ts             Auth/session middleware (Next 16 "proxy" convention)
```

## 7. Brand

- Colours: gold `#c5a45d`, ember `#cc2803`, white — defined in
  [`app/globals.css`](app/globals.css) (`@theme`).
- Fonts: Playfair Display (headings), Inter (body).
- Editable site content/contact details live in [`lib/site.ts`](lib/site.ts).
