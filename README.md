# GEMO Furniture — E-commerce Site

A custom-built Next.js storefront for GEMO Furniture: affordable, space-saving
furniture for apartments, dorms, and first homes, shipped across the USA.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Zustand** for cart state (persisted to the browser)
- **Stripe Checkout** for payment
- **Shippo** for live USPS/UPS/FedEx shipping rate quotes
- A lightweight JSON-file "database" for admin edits and the order log (see
  **Moving to a real database** below before launch)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your API keys
npm run dev
```

Open http://localhost:3000. The storefront, cart, and checkout flow all work
out of the box with placeholder data and a flat-rate shipping estimate — you
don't need any API keys just to click around locally.

## What's wired up vs. what needs your keys

| Feature | Works without setup? | Needs |
|---|---|---|
| Browse catalog, cart, quantity, persistence | Yes | — |
| Checkout payment (Stripe) | Shows a friendly error until configured | `STRIPE_SECRET_KEY` |
| Live carrier shipping rates (Shippo) | Falls back to a flat-rate estimate | `SHIPPO_API_TOKEN` |
| Order log in `/admin/orders` | Empty until the webhook is configured | `STRIPE_WEBHOOK_SECRET` |
| Admin panel (`/admin`) | Locked out | `ADMIN_PASSWORD` |
| Product photo uploads in `/admin/products` | Shows a friendly "not set up yet" message | `BLOB_READ_WRITE_TOKEN` (Vercel Blob) |

See `.env.example` for every variable and where to get each key.

## Adding your real product catalog

Right now the catalog is placeholder data in `src/lib/products.ts` (14 sample
products) so every page is fully browsable end to end. To bring in your real
products and photos, either:

1. **Quick path:** edit `src/lib/products.ts` directly — replace the `PRODUCTS`
   array with your real items (name, price in cents, description, dimensions,
   category, stock). Product photography isn't wired to real image files yet
   (see below); every product currently renders a colored icon placeholder.
2. **Admin panel path:** once `ADMIN_PASSWORD` is set, use `/admin/products`
   to add products, edit every field (name, category, price, description,
   dimensions, weight, stock, visibility) on the starter catalog or your own
   items, and upload real photos — changes save to
   `data/product-overrides.json` and `data/custom-products.json` and show up
   on the storefront immediately.

### Adding real product photos

Any product without an uploaded photo renders a stylized icon on a
brand-tinted background (see `src/components/ProductImage.tsx`) so the site
never looks broken while you're still adding real photography. To add real
photos, use the **Edit** (pencil) button on a product in `/admin/products` —
the photo grid there uploads directly to Vercel Blob storage and photos
appear on the storefront immediately, no code changes needed.

This requires `BLOB_READ_WRITE_TOKEN`, which Vercel sets automatically once
you connect Blob storage: in the Vercel dashboard, go to **Storage → Create
Database → Blob**, connect it to this project, then redeploy. Until then,
uploads show a friendly message explaining that step instead of failing.
For local development, run `vercel env pull` after connecting Blob storage
to pull the token into `.env.local`.

## Admin panel

Visit `/admin` after setting `ADMIN_PASSWORD` (and optionally
`ADMIN_SESSION_SECRET`) in `.env.local`. From there you can:

- View a dashboard of product count, orders, revenue, and low-stock items
- Add new products, or edit any field (name, category, price, compare-at
  price, description, dimensions, weight, stock, visibility) on existing ones
- Upload and remove product photos (requires `BLOB_READ_WRITE_TOKEN`, see above)
- View the order log (once the Stripe webhook is configured)

This is a single shared admin password, not a multi-user system — good for a
small team getting started, but plan to move to real user accounts if you add
staff later.

## Shipping (Shippo)

`src/lib/shippo.ts` calls Shippo to quote live USPS/UPS/FedEx rates for a
destination address and the items in the cart. Configure:

- `SHIPPO_API_TOKEN` — from your Shippo account
- `WAREHOUSE_STREET1` / `WAREHOUSE_CITY` / `WAREHOUSE_STATE` / `WAREHOUSE_ZIP` — your ship-from address

Until `SHIPPO_API_TOKEN` is set, checkout uses a transparent flat-rate
estimate (clearly labeled as an estimate) so the flow is fully testable.

The parcel dimensions used for rating are currently a conservative shared box
estimate based on total cart weight (see `buildParcelFromCart` in
`src/lib/shippo.ts`). For accurate large-furniture rates, add real per-product
package dimensions to the catalog and use those instead once you have them.

## Payments (Stripe)

- Set `STRIPE_SECRET_KEY` (test key while developing, live key at launch).
- Checkout Sessions are created server-side in `src/app/api/checkout/route.ts`
  — prices are always re-derived from the server catalog, never trusted from
  the browser.
- To log paid orders into `/admin/orders`, add a webhook endpoint in the
  [Stripe Dashboard](https://dashboard.stripe.com/webhooks) pointing to
  `https://yourdomain.com/api/webhooks/stripe` for the `checkout.session.completed`
  event, and set `STRIPE_WEBHOOK_SECRET` to the signing secret it gives you.
  For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Moving to a real database

The JSON files under `/data` (`product-overrides.json`, `custom-products.json`,
`orders.json`) are a zero-config way to make the admin panel and order log
actually work today. **They will not persist in production on serverless
hosts like Vercel** — the filesystem there is read-only/ephemeral at runtime.

Before taking real orders in production, replace `src/lib/json-file-store.ts`'s
read/write calls with a real database — e.g. Postgres via
[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres),
[Neon](https://neon.tech), or [Supabase](https://supabase.com), using an ORM
like [Prisma](https://www.prisma.io) or [Drizzle](https://orm.drizzle.team).
`src/lib/catalog-store.ts` and `src/lib/orders-store.ts` are the only two
files that talk to storage — swapping their internals is enough, no page or
API route code needs to change.

## Deploying

This app deploys cleanly to [Vercel](https://vercel.com/new) (the team behind
Next.js): connect the repo, add the environment variables from `.env.example`
in the Vercel project settings, and deploy. Remember to point the Stripe
webhook at your live domain once it's up, and swap the JSON file store for a
real database first (see above).

## Project structure

```
src/
  app/
    page.tsx                     Home
    about/page.tsx                About (brand story)
    shop/page.tsx                  Catalog with category filter
    shop/[slug]/page.tsx            Product detail
    cart/page.tsx                    Cart
    checkout/shipping/page.tsx        Address + live shipping rate selection
    checkout/success|cancel/           Post-checkout pages
    admin/                               Password-protected admin panel
    api/checkout/                         Creates the Stripe Checkout Session
    api/shipping/rates/                    Calls Shippo for live rates
    api/webhooks/stripe/                    Logs paid orders
    api/admin/products/                      Admin CRUD for the catalog
  components/                    UI building blocks
  lib/
    products.ts                   Placeholder catalog + read functions
    catalog-store.ts               Admin overrides / custom products (JSON)
    orders-store.ts                 Order log (JSON)
    cart-store.ts                    Zustand cart state
    stripe.ts / shippo.ts              Payment / shipping integrations
```
