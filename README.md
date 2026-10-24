# Niche Perfume India — Website

A complete perfume-decant store: storefront, cart, WhatsApp ordering (no payment gateway), and a secure admin dashboard.

**Stack :** Next.js 14 (App Router) · TypeScript ·  (Postgres + Auth + Storage) · Vercel

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

**First things to do in the admin:**
1. **Settings → WhatsApp number** — set your real number (country code + digits, e.g. `919876543210`). *Every order and enquiry is sent to this number. The demo value is a placeholder!*
2. **Settings** → check shipping fee / free-shipping threshold, social links, address, email.
3. **Pages & FAQ** → edit About, Shipping & Returns, Terms, Privacy and FAQ. Replace the template wording with your own and have the policies reviewed — they are generic examples, not legal advice.
4. **Products** → edit/replace demo products, prices, stock and photos.
---

## How ordering works

1. Customer adds items → Cart → Checkout (name, phone, address, COD or UPI-via-WhatsApp).
2. The server **re-prices everything from the database** (the browser's prices are never trusted), checks and decrements stock atomically (`create_order()` SQL function), and saves the order.
3. A WhatsApp window opens with the full order pre-filled to **your** number. You confirm and collect payment (UPI/COD) there.
4. See and manage orders in **Admin → Orders** (status, notes, one-click WhatsApp to the customer).

If the database isn't configured the order still opens in WhatsApp (marked "demo").


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

