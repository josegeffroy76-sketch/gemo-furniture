# GEMO Furniture — E-commerce Site

A custom-built Next.js storefront for GEMO Furniture: affordable, space-saving
furniture for apartments, dorms, and first homes, shipped across the USA.

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Zustand** for cart state (persisted to the browser)
- **Stripe Checkout** for payment
- **Shippo** for live USPS/UPS/FedEx shipping rate quotes
- **Redis (via Vercel Marketplace, e.g. Upstash)** for admin edits and the
  order log — required in production (see **Persisting admin data** below);
  falls back to local JSON files under `/data` with zero setup for local dev

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
| Admin edits & orders persisting in production | **Fails in production without it** — local dev works via a JSON-file fallback | `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel Redis/KV) |
| Address autocomplete at checkout | Falls back to a plain manual address field | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Google Places) |

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
- View the order log (once the Stripe webhook is configured), and generate a
  real, purchased shipping label — with the customer's address already
  filled in — via the **Generate Label** button on each order (requires
  `SHIPPO_API_TOKEN`; see **Shipping (Shippo)** below). This re-quotes a
  fresh rate at click time and tries to match the carrier/service the
  customer paid for; if that exact option is no longer available it falls
  back to the cheapest rate and flags the price difference.
- View every product rating/review as soon as it's submitted, and delete any
  that shouldn't be public, in `/admin/reviews` — see **Ratings & reviews**
  below.

This is a single shared admin password, not a multi-user system — good for a
small team getting started, but plan to move to real user accounts if you add
staff later.

## Ratings & reviews

Customers rate and review a product from a link they receive **by email a
couple weeks after purchase** (`REVIEW_REQUEST_DELAY_DAYS`, default 14) —
not right at checkout, since nobody can honestly rate furniture they haven't
received yet. A daily [Vercel Cron job](https://vercel.com/docs/cron-jobs)
(`src/app/api/cron/review-requests`, scheduled in `vercel.json`) finds paid
orders past that age that haven't gotten the email yet and sends it via
[Resend](https://resend.com) — see `.env.example` for `RESEND_API_KEY` /
`RESEND_FROM_EMAIL`. Without a Resend key, the cron just skips sending
instead of erroring, so everything else keeps working.

The email links to `/review/[orderId]`, a public page listing every product
from that order with a 1-5 star + optional written review form. Submitting
one calls `POST /api/reviews`, which verifies the product was genuinely part
of that paid order before saving — a customer can only review a product once
per order.

A product's average rating and reviews only appear on its storefront page
(`/shop/[slug]`) once it has at least 5 reviews (`PUBLIC_REVIEW_THRESHOLD` in
`src/lib/reviews-store.ts`) — a lone review isn't a meaningful signal yet.
Admins can see every review immediately, regardless of that threshold, in
`/admin/reviews`, along with each product's progress toward going public and
a delete button for any review that shouldn't stay up.

To test the email locally/manually without waiting for the cron schedule,
call `GET /api/cron/review-requests` directly (add
`Authorization: Bearer <CRON_SECRET>` if you've set that env var).

## Shipping (Shippo)

`src/lib/shippo.ts` calls Shippo to quote live USPS/UPS/FedEx rates for a
destination address and the items in the cart. Configure:

- `SHIPPO_API_TOKEN` — from your Shippo account
- `WAREHOUSE_STREET1` / `WAREHOUSE_CITY` / `WAREHOUSE_STATE` / `WAREHOUSE_ZIP` — your ship-from address

Until `SHIPPO_API_TOKEN` is set, checkout uses a transparent flat-rate
estimate (clearly labeled as an estimate) so the flow is fully testable.

Each product can have real packed-box dimensions (`shipLengthIn` /
`shipWidthIn` / `shipHeightIn`, in inches, plus the existing `weightLbs`
field as that box's weight) set on it via the **Edit** panel in
`/admin/products` — Shippo then rates one parcel per cart unit using that
product's real size and weight (see `buildParcelsFromCart` in
`src/lib/shippo.ts`). Set these for every real product before launch: a
missing/generic box size is what caused wildly inflated, UPS-only quotes
during testing — an oversized box racks up "dimensional weight" charges,
and USPS/FedEx Ground reject oversized packages outright rather than quote
them, leaving only freight-capable carriers like UPS to respond.

Every field in the admin panel's shipping section is now individually
labeled (Weight, Length, Width, Height) so it's clear what goes where. For
products that ship in more than one physical box (e.g. a sectional with a
separate chaise box), check **"This item ships in more than one box"** to
reveal a full Weight/Length/Width/Height set for box 2, with an
**"Add another box"** link for a 3rd, 4th, etc. Each extra box is stored on
the product as `extraShipBoxes` and quoted as its own parcel in the same
Shippo shipment request — this only changes what's included in the
existing `parcels` array Shippo already receives, so it doesn't require any
changes to your Shippo account setup.

## Address autocomplete (Google Places)

The checkout shipping form (`src/app/checkout/shipping/page.tsx`) uses
`src/components/AddressAutocomplete.tsx` to offer live address suggestions
as the customer types, cutting down on shipping typos. It's optional — with
no API key configured, the form just shows a plain manual street-address
field, unchanged from before.

To enable it:

1. Create a project at the [Google Cloud Console](https://console.cloud.google.com)
   and enable **Places API (New)**. This requires a billing account on the
   project (a card on file), but normal usage for a store this size should
   stay within Google's monthly free credit.
2. Create an API key under **APIs & Services → Credentials**, then restrict
   it to **Places API (New)** and to your site's domain under **HTTP
   referrers** — this key runs in the browser, so restricting it (rather
   than keeping it secret) is what keeps it safe to expose.
3. Add it as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in Vercel (and `.env.local`
   for local development), then redeploy.

Selecting a suggestion fills in the street address, city, state, and ZIP;
the street address field stays visible and editable in case a customer's
address doesn't have a matching suggestion.

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

## Sales tax (Stripe Tax)

Checkout uses [Stripe Tax](https://dashboard.stripe.com/settings/tax) to
calculate US sales tax automatically — it adds a "Tax" line after the
product subtotal and shipping, using the customer's address (attached to a
Stripe Customer created at checkout time — see `src/app/api/checkout/route.ts`)
to figure out the exact rate, including California's state + county + city
+ district combination.

This requires a one-time setup in the Stripe Dashboard, not in code:

1. Go to **Settings → Tax** and set your **Origin address** (the warehouse
   address, since that's where you have a physical presence).
2. Under **Registrations**, add **California** — physical presence there
   (a warehouse, office, or employees) means you're required to collect CA
   sales tax. Only add other states once you've confirmed with an
   accountant that you've crossed that state's economic nexus threshold
   (commonly $100k in sales or 200 transactions/year, but this varies by
   state) — until a state is registered here, Stripe correctly charges $0
   tax for orders shipping there rather than guessing.
3. That's it — no `STRIPE_SECRET_KEY` changes needed. Until Stripe Tax is
   turned on in the dashboard, `automatic_tax` still runs but simply
   calculates $0 tax everywhere, so checkout keeps working either way.

This isn't legal or tax advice — confirm your actual nexus obligations
(which states, when to start collecting, filing requirements) with an
accountant as the business grows into new states.

## Persisting admin data (Redis)

**This is required before taking real orders.** Vercel's application
filesystem is read-only at runtime, so without a real store connected, every
admin edit (price/stock changes, new products, photos) and every order
logged by the Stripe webhook fails instantly in production.

`src/lib/json-file-store.ts` handles this automatically: if Redis
credentials are present, reads and writes go to Redis; otherwise it falls
back to local JSON files under `/data` (fine for local development, not for
production).

To connect Redis:

1. In the Vercel dashboard, go to your project's **Storage** tab → **Create
   Database** → pick a Redis/KV provider (e.g. [Upstash](https://vercel.com/marketplace/upstash/upstash-kv)).
2. Choose the **Free** plan (plenty for this app's usage) and connect it to
   this project for the **Production** and **Preview** environments. Leave
   the custom prefix blank.
3. Redeploy. Vercel injects the URL/token pair automatically — the exact
   variable names vary by provider (`KV_REST_API_URL` / `KV_REST_API_TOKEN`,
   or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`); the store
   checks the common variants, so no code changes should be needed.

If you'd rather use a relational database instead of Redis (e.g. for more
complex reporting later), replace `src/lib/json-file-store.ts`'s read/write
calls with Postgres via [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres),
[Neon](https://neon.tech), or [Supabase](https://supabase.com), using an ORM
like [Prisma](https://www.prisma.io) or [Drizzle](https://orm.drizzle.team).
`src/lib/catalog-store.ts` and `src/lib/orders-store.ts` are the only two
files that talk to storage — swapping the internals of
`json-file-store.ts` is enough, no page or API route code needs to change.

## Deploying

This app deploys cleanly to [Vercel](https://vercel.com/new) (the team behind
Next.js): connect the repo, add the environment variables from `.env.example`
in the Vercel project settings, and deploy. Remember to point the Stripe
webhook at your live domain once it's up, and connect Redis first (see
**Persisting admin data** above) — without it, the admin panel and order log
will fail in production.

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
