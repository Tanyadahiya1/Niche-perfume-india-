# Niche Perfume India — Website

A complete perfume-decant store: storefront, cart, WhatsApp ordering (no payment gateway), and a secure admin dashboard.

**Stack (all free tier):** Next.js 14 (App Router) · TypeScript · Supabase (Postgres + Auth + Storage) · Vercel

> Your original homepage hero is preserved: same HTML structure, CSS (`src/app/original-home.css` is your stylesheet, unchanged), fonts, colours, dark/"glass" theme toggle and animations. All other pages reuse the same colour variables and fonts.

---

## What is included

| Page | URL |
|---|---|
| Home (your hero + featured, why-us, reviews, Instagram) | `/` |
| Decants / Partials / Retail packs / Samples | `/decants` `/partials` `/retail` `/samples` |
| Full collection with search and filters | `/collection` |
| Product details (size tiles, inspired-by, notes) | `/product/<slug>` |
| Cart · Checkout (WhatsApp + COD) | `/cart` `/checkout` |
| Customize · Sell your perfume · About · Contact · FAQ · Policies | `/customize` `/sell` `/about` `/contact` `/faq` `/policies` |
| Admin dashboard | `/admin` |

**22 demo products / 88 sizes** with images are included. Everything is editable from `/admin`: products, sizes, prices, stock, images (upload or URL), orders, enquiries, FAQ, About/policy text, business settings (WhatsApp number, shipping rules, hero text, announcement bar, reviews, etc.).

---

## Step 1 — Run it on your computer (demo mode, no accounts needed)

1. Install **Node.js 20 LTS** from https://nodejs.org (this also installs `npm`).
2. Unzip the project, open a terminal **inside the folder** (the one containing `package.json`).
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

In demo mode the demo products are read-only and the admin is disabled, but browsing, cart and WhatsApp checkout work. Continue below for the real database.

## Step 2 — Create your Supabase project (free)

1. Go to https://supabase.com → **Start your project** → sign up.
2. **New project**: choose a name, a strong database password (save it), and the region closest to you (e.g. *Mumbai / ap-south-1*). Wait ~2 minutes.

## Step 3 — Add your keys

1. In Supabase: **Project Settings → API**. Copy the **Project URL**, the **anon public** key and the **service_role** key.
2. In the project folder, copy `.env.example` to a new file named `.env.local` and fill it in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...   (SECRET — never share or commit it)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Step 4 — Create the database tables and demo products

1. Supabase → **SQL Editor → New query**.
2. Open `supabase/all_in_one_setup.sql` in a text editor, copy **everything**, paste it into the SQL Editor and click **Run**. You should see "Success".
   (It is the same as running `migrations/001_schema.sql` then `migrations/002_seed_demo_products.sql`. Safe to run twice.)

## Step 5 — Create your admin login

1. Supabase → **Authentication → Users → Add user → Create new user**. Enter your email + a strong password and tick **Auto Confirm User**.
2. Open `supabase/migrations/003_make_me_admin.sql`, replace `you@example.com` with that exact email, paste into the SQL Editor and **Run**.

Only emails in the `admin_users` table can access `/admin` — being logged in is not enough. Security is enforced twice: in the app **and** in the database (Row Level Security).

## Step 6 — Start and log in

```bash
npm run dev
```
Visit http://localhost:3000/admin/login and sign in.

**First things to do in the admin:**
1. **Settings → WhatsApp number** — set your real number (country code + digits, e.g. `919876543210`). *Every order and enquiry is sent to this number. The demo value is a placeholder!*
2. **Settings** → check shipping fee / free-shipping threshold, social links, address, email.
3. **Pages & FAQ** → edit About, Shipping & Returns, Terms, Privacy and FAQ. Replace the template wording with your own and have the policies reviewed — they are generic examples, not legal advice.
4. **Products** → edit/replace demo products, prices, stock and photos.

## Step 7 — Put it online with Vercel (free)

1. Create a free account at https://github.com, create a new **private** repository and upload this project (do **not** upload `.env.local`; `.gitignore` already excludes it).
2. Go to https://vercel.com → **Add New → Project** → import the repository.
3. Under **Environment Variables** add the same 4 variables as in `.env.local` (set `NEXT_PUBLIC_SITE_URL` to your Vercel/own domain).
4. Click **Deploy**. Later, to use your own domain: Vercel → *Settings → Domains*.
5. Supabase → **Authentication → URL Configuration** → set *Site URL* to your live address.

---

## How ordering works

1. Customer adds items → Cart → Checkout (name, phone, address, COD or UPI-via-WhatsApp).
2. The server **re-prices everything from the database** (the browser's prices are never trusted), checks and decrements stock atomically (`create_order()` SQL function), and saves the order.
3. A WhatsApp window opens with the full order pre-filled to **your** number. You confirm and collect payment (UPI/COD) there.
4. See and manage orders in **Admin → Orders** (status, notes, one-click WhatsApp to the customer).

If the database isn't configured the order still opens in WhatsApp (marked "demo").

## Editing later (no code needed)

| I want to change… | Go to |
|---|---|
| Products, sizes, prices, stock, photos | Admin → Products |
| WhatsApp number, shipping, hero text, announcement bar, stats, reviews, Instagram tiles, page headings | Admin → Settings |
| About, policies, FAQ | Admin → Pages & FAQ |
| Colours / fonts / layout | `src/app/original-home.css` (your original) and `src/app/site.css` |

Text areas that take lists use one item per line, with `|` separating parts (hints are shown under each field).

## Project structure

```
src/app/(site)/        storefront pages
src/app/admin/         login + dashboard (protected)
src/app/api/           /api/orders, /api/enquiry
src/components/        UI components (admin ones in components/admin)
src/lib/               data access, Supabase clients, defaults, WhatsApp helpers
src/data/seed.json     demo data used when Supabase isn't configured
public/images/         hero bottles, product images (SVG), icons
supabase/migrations/   001 schema+RLS, 002 demo products, 003 make-me-admin
supabase/all_in_one_setup.sql   001+002 in one paste
scripts/generate_assets.py      (optional) regenerates demo images/data
```

## Replacing the demo images

The 22 demo bottles are simple illustrations so the site is never empty. Replace them with real photos: Admin → Products → Edit → *Upload*. The four hero bottles on the home page are `public/images/image1.png … image4.png` — overwrite these files with your own transparent PNGs (same names).

## Troubleshooting

- **"Supabase is not configured"** on the login page → `.env.local` missing/misnamed, or you didn't restart `npm run dev`.
- **Login works but bounces back with "not an admin"** → the email in step 5 must match exactly.
- **Checkout says "couldn't save your order"** → `SUPABASE_SERVICE_ROLE_KEY` missing, or step 4 SQL wasn't run.
- **Image upload fails** → step 4 SQL creates the `product-images` bucket; re-run it.
- **Build errors on Vercel** → run `npm run build` locally to see them. `next.config.mjs` currently ignores type/lint warnings so a first deploy isn't blocked; set both flags to `false` once you want strict checks (`npm run typecheck`).

## Security notes

- The service-role key is used only in server code (`/api/*`) and must never start with `NEXT_PUBLIC_`.
- Public visitors can only **read** the catalogue/content; every write goes through the server or an authenticated admin (Row Level Security is enabled on every table).
- Forms have a hidden honeypot field and server-side validation. For heavy traffic consider adding rate limiting / a CAPTCHA (e.g. Cloudflare Turnstile).
- Brand names in the demo catalogue belong to their owners; make sure the products you list and the claims you make (e.g. "100% authentic") are accurate for your business.
