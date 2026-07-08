# Serowe Travel — Website & Staff Portal Documentation

_A reference for the Serowe Travel website: its structure, technology, integrations, database, and day‑to‑day admin instructions._

---

## 1. Overview

**Serowe Travel** is an IATA‑accredited, Amadeus‑partnered travel agency based in Serowe, Botswana, specialising in luxury and sustainable travel. The website is both a **public marketing site** and a **staff back‑office (admin portal)** in a single application.

The site has two audiences:

- **Visitors** — browse the company, services, airlines, destinations, travel packages, the DLM Group offering, and submit enquiries.
- **Staff / administrators** — sign in to a private dashboard to manage travel packages, airline logos, all website images, enquiries, and site settings.

---

## 2. Technology & Programming Language

The project is written primarily in **TypeScript** (a typed superset of JavaScript).

| Layer | Technology |
| --- | --- |
| **Language** | TypeScript |
| **Framework** | Next.js 16 (App Router) |
| **UI library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Icons** | lucide-react |
| **Animation** | framer-motion + lightweight CSS animations |
| **Forms & validation** | react-hook-form + Zod |
| **Backend / database** | Supabase (PostgreSQL, Auth, Storage, Row Level Security) |
| **Email notifications** | FormSubmit.co (see §7) |
| **Hosting** | Vercel |
| **Source control** | GitHub |

There is **no separate backend server**. Next.js runs both the pages and the server‑side logic (via **Server Actions** and middleware), and Supabase provides the database, authentication, and file storage.

---

## 3. Project Structure

The codebase uses the Next.js **App Router** with **route groups** — folders in parentheses that organise routes without appearing in the URL.

```
app/
  (site)/          → Public website (shares the header + footer layout)
    page.tsx           Home
    about/             About Us
    services/          Services & Tours
    airlines/          Airlines carousel page
    destinations/      Destinations
    packages/          Package listing
      [slug]/          Individual package detail page
    dlm-group/         DLM Group page
    contact/           Contact + enquiry form
  (admin)/         → Staff portal (shares the sidebar layout, auth-protected)
    admin/
      page.tsx           Dashboard
      packages/          Package management (list / new / edit)
      airlines/          Airline carousel management
      images/            Website image manager
      enquiries/         Enquiry inbox
      settings/          Social links & settings
  login/           → Staff login screen
  layout.tsx       → Root layout (fonts, global styles)

components/
  site/            Public UI (Header, Footer, Hero, PageHero, AirlineCarousel, …)
  admin/           Admin UI (Sidebar, PackageForm, ImageUploader, ImagesManager,
                   AirlinesManager, EnquiryCard, SettingsForm, …)
  ui/              Shared primitives (Button, Container, Reveal, SectionHeading)

lib/
  site.ts          Static site content: company details, navigation, services,
                   destinations, company values
  site-images.ts   Catalogue of every editable image "slot" + its default
  queries.ts       Data-fetching helpers (packages, airlines, images, settings)
  types.ts         TypeScript data types
  validators.ts    Zod validation schemas (enquiry, package)
  auth.ts          Current-user / profile helpers
  upload.ts        Image upload helper (to Supabase Storage)
  utils.ts         Small utilities (formatting, classnames)
  supabase/        Supabase client setup (browser, server, admin, middleware)

supabase/
  schema.sql       Full database schema, RLS policies, storage bucket
  migrations/      Incremental SQL changes to run in Supabase

public/            Static assets (bundled images, logos, flyers)
proxy.ts           Next.js middleware — session refresh + /admin route guard
next.config.ts     Next.js config (allowed remote image hosts, etc.)
```

> **Note on `proxy.ts`:** Next.js 16 renamed the traditional `middleware.ts` to **`proxy.ts`**. It runs on every request to refresh the Supabase login session and to redirect unauthenticated users away from `/admin`.

---

## 4. Web Pages

### Public pages

| Page | Route | Purpose |
| --- | --- | --- |
| **Home** | `/` | Hero slideshow, value propositions, about preview, services, featured packages, destinations, closing call‑to‑action. |
| **About** | `/about` | Company story, mission & vision, values, **Our Team** (quality management), and accreditations (IATA & Amadeus, Tourism Licence, RateHawk & Stay Global). |
| **Services & Tours** | `/services` | Detailed breakdown of the five service areas. |
| **Airlines** | `/airlines` | Carousel of airline partner logos with descriptions and website links. |
| **Destinations** | `/destinations` | Botswana, SADC region, and international destinations. |
| **Packages** | `/packages` | Grid of published travel packages (hidden gracefully when none are published). |
| **Package detail** | `/packages/[slug]` | Full itinerary, inclusions/exclusions, gallery, pricing. |
| **DLM Group** | `/dlm-group` | DLM Group (Pty) Ltd — training, virtual assist, hospitality, recruitment, the flight‑reservation flyer, contacts, and the *Connect · Learn · Grow* motto. Styled in DLM's burgundy/red/gray palette. |
| **Contact** | `/contact` | Company contact details, map, and the enquiry form. |

The top navigation order is: **Home · About · Services & Tours · Airlines · Destinations · Packages · DLM Group · Contact**.

### Admin pages (require sign‑in)

| Page | Route | Purpose |
| --- | --- | --- |
| **Dashboard** | `/admin` | Overview / entry point. |
| **Packages** | `/admin/packages` | Create, edit, publish, and delete travel packages. |
| **Airlines** | `/admin/airlines` | Add, reorder, hide, and remove airline logos. |
| **Images** | `/admin/images` | Replace any photo on the public website. |
| **Enquiries** | `/admin/enquiries` | Read and manage submitted enquiries. |
| **Settings** | `/admin/settings` | Edit social media links. |
| **Login** | `/login` | Staff sign‑in. |

---

## 5. Backend Information

### Server Actions
Instead of a REST API, form submissions and data changes use **Next.js Server Actions** — asynchronous functions that run on the server. Examples:
- `submitEnquiry` (contact form)
- `createPackage` / `updatePackage` / `deletePackage`
- `createAirline` / `deleteAirline` / `toggleAirline` / `moveAirline`
- `saveSiteImage` / `resetSiteImage`
- `updateSettings`

### Authentication
- Handled by **Supabase Auth** (email + password).
- `proxy.ts` middleware refreshes the session on every request and redirects anonymous users from `/admin` to `/login`.
- **Roles** are stored on each user's profile:
  - **admin** — full access, including settings.
  - **staff** — manage packages, airlines, images, and enquiries.
  - **viewer** — read‑only.

### Security — Row Level Security (RLS)
Every database table has **RLS policies** so the database itself enforces who can read/write:
- Public visitors can read only *published* packages, *active* airlines, image overrides, and settings.
- Only signed‑in staff/admins can create or change content.
- Anyone can *insert* an enquiry (so the contact form works), but only staff can read them.

### Data validation
User input is validated with **Zod** schemas in `lib/validators.ts` (e.g. the enquiry form checks name, email, and message length, and includes a hidden "honeypot" field to silently reject spam bots).

---

## 6. Third‑Party Integrations

| Integration | Used for |
| --- | --- |
| **Supabase** | PostgreSQL database, authentication, file storage, and RLS. |
| **FormSubmit.co** | Emails enquiry notifications without an API key (see §7). |
| **Google Maps (embed)** | The location map on the Contact page. |
| **Vercel** | Hosting, builds, custom domain, and environment variables. |
| **GitHub** | Source‑code repository and deployment trigger. |

---

## 7. Enquiry / Email Flow

When a visitor submits the contact form, the server action does two things:

1. **Saves** the enquiry to the `enquiries` table → visible in **Admin → Enquiries**.
2. **Emails** a notification to the `CONTACT_EMAIL` address (currently `info@serowetravel.com`) via **FormSubmit.co**.

> **FormSubmit activation:** FormSubmit requires each recipient address to be confirmed **once**. After setting/changing the address, submit the live form a single time and click the activation link emailed to that address. Delivery is automatic afterwards. Because enquiries are also saved to the database, none are lost even if email delivery is delayed.

> **Changing the recipient:** update the `CONTACT_EMAIL` environment variable in Vercel and redeploy — no code change required.

_A more robust alternative (a transactional email provider such as Resend, with delivery logs and no per‑address activation) can be adopted later; only the "send email" step of the flow would change._

---

## 8. Database & Storage

All data lives in **Supabase (PostgreSQL)**. The full schema is in `supabase/schema.sql`; incremental changes are in `supabase/migrations/`.

### Tables

| Table | Contents |
| --- | --- |
| **profiles** | Staff accounts and their role (admin / staff / viewer). |
| **packages** | Travel packages — title, slug, type, destination, duration, price, description, inclusions, exclusions, itinerary, images, status, featured flag. |
| **enquiries** | Contact‑form submissions — name, email, phone, subject, message, status, notes. |
| **site_settings** | Single row of editable social‑media links. |
| **site_images** | Admin overrides for website images, keyed by named "slot" (a row exists only for images that have been changed). |
| **airlines** | Airline carousel entries — name, logo, website link, description, order, active flag. |

### File storage
Uploaded images (package photos, website image overrides, airline logos) are stored in a **public Supabase Storage bucket named `package-images`**. The app saves the resulting public URL in the relevant table. Allowed image hosts are declared in `next.config.ts`.

### Applying database changes
Run the SQL files in the **Supabase → SQL Editor**:
1. First‑time setup: run `supabase/schema.sql`.
2. Feature updates: run the files in `supabase/migrations/` in order (they are safe to re‑run).

---

## 9. Admin Panel — Instructions

### 9.1 Signing in
1. Go to **`/login`** on the website.
2. Enter your staff email and password (created in Supabase → Authentication).
3. On success you land on the **Dashboard**. Use the left sidebar to navigate. "Sign out" is at the bottom of the sidebar.

> To make a user an administrator, run in Supabase → SQL Editor:
> ```sql
> update public.profiles set role = 'admin'
> where id = (select id from auth.users where email = 'YOUR_EMAIL');
> ```

### 9.2 Creating a travel package
1. Sidebar → **Packages** → **New Package**.
2. Fill in the details:
   - **Title** (required) and **Slug** (the URL; auto‑generated from the title).
   - **Type** — luxury / family / health / adventure / custom.
   - **Destination, Duration, Price, Currency** (currency defaults to **BWP**).
   - **Description**, **Inclusions**, **Exclusions** (one item per line), and an optional **Itinerary**.
   - **Featured image** and **Gallery images** — click **Upload** to add photos (stored in Supabase).
   - **Status** — `draft` (hidden), `published` (live on the site), or `archived`.
   - **Featured** — tick to highlight the package on the home page.
3. **Save.** Published packages appear immediately on `/packages`.
4. To change one later: **Packages** → pencil (edit) icon. To remove: the trash icon.

> Packages stay hidden from the public site while in `draft` or `archived` status. The public packages section is hidden entirely when there are no published packages.

### 9.3 Modifying website pictures
1. Sidebar → **Images**.
2. Images are grouped by area: **Branding, Homepage hero, Homepage, Service cards, Destination cards, Page banners**.
3. Each image shows a **Default** or **Custom** badge and a preview.
4. To change one: click **Upload** (or **Replace**) and pick a file — it uploads to Supabase and goes live immediately, everywhere that image appears.
5. To undo a change: click **Reset**, which reverts that slot to the original bundled image.

> **How it works:** the site ships with a default image for every slot. Uploading creates an override in the `site_images` table; resetting deletes the override. Nothing ever breaks — until you upload, the site shows the built‑in default.
>
> The editable image slots include the site logo, the DLM Group logo, the three home‑page hero slides, home‑page section photos, the service and destination card images, and the banner at the top of every page (About, Services, Airlines, Destinations, Packages, DLM Group, Contact).

### 9.4 Managing the Airlines carousel
1. Sidebar → **Airlines**.
2. **Add an airline:** enter the name, an optional website link, an optional short description, and upload the logo/image → **Add Airline**.
3. In the list you can:
   - **Reorder** with the ↑ / ↓ arrows,
   - **Hide/show** with the eye icon,
   - **Delete** with the trash icon.
4. Changes appear on the public **/airlines** page automatically. On that page, the cards scroll with **‹ / ›** buttons when there are enough to overflow; a few are simply shown centred.

### 9.5 Handling enquiries
1. Sidebar → **Enquiries**.
2. Each submission shows the contact's details and message. Update its **status** (new / in progress / replied / closed) and add internal **notes**.
3. Enquiries also arrive by email (see §7) so staff are notified in real time.

### 9.6 Editing social links
1. Sidebar → **Settings**.
2. Enter Facebook, Instagram, and/or LinkedIn URLs. Blank fields hide that icon in the footer. (Settings edits are admin‑only.)

---

## 10. Environment Variables

Configured locally in `.env.local` and in **Vercel → Settings → Environment Variables**:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public (anon) key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service‑role key — **server only, never expose**. |
| `CONTACT_EMAIL` | Address enquiries are emailed to (currently `info@serowetravel.com`). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://serowetravel.com`). |

The site still runs without Supabase keys (packages stay hidden and enquiries fall back to email only), but the staff portal requires them.

---

## 11. Deployment

- Code is pushed to **GitHub**; **Vercel** builds and deploys automatically.
- Set the environment variables (§10) in Vercel for the Production environment.
- Add the custom domain (**serowetravel.com**) in Vercel → Settings → Domains.
- After changing an environment variable, **redeploy** for it to take effect.
- Verify a production build locally at any time with `npm run build`.

---

## 12. Quick Reference — Common Tasks

| I want to… | Where |
| --- | --- |
| Add/edit a travel package | Admin → Packages |
| Change any photo on the site | Admin → Images |
| Add an airline logo | Admin → Airlines |
| Read enquiries | Admin → Enquiries |
| Change social media links | Admin → Settings |
| Change the enquiry recipient email | `CONTACT_EMAIL` in Vercel, then redeploy |
| Apply a database change | Supabase → SQL Editor (run files in `supabase/migrations/`) |
| Make a user an admin | Supabase → SQL Editor (`update public.profiles …`) |

---

_Last updated: 2026‑07‑06._
