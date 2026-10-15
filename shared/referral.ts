/**
 * Outbound referral signature for links from RPLT USA to the store.
 *
 * Every store link is built here so the store always receives the same, predictable
 * set of parameters. Static parameters are rendered into the HTML (so they survive
 * with JavaScript disabled and are visible to crawlers). Visitor level parameters are
 * appended in the browser at click time by `app/plugins/referral.client.ts`.
 *
 * Static (always present):
 *   utm_source   = rpltusa
 *   utm_medium   = referral
 *   utm_campaign = rpltusa_site
 *   utm_content  = placement of the link, for example hero_primary or product_card
 *   utm_term     = product slug, when the link is for a specific peptide
 *   ref          = rpltusa
 *
 * Added at click time (when available):
 *   rplt_vid  = anonymous visitor id, stable per browser
 *   rplt_page = RPLT USA path the click happened on
 *   rplt_lp   = RPLT USA landing path of the visitor's current session or campaign touch
 *   rplt_ref  = external referrer host that brought the visitor to RPLT USA
 *   rplt_src, rplt_med, rplt_cmp, rplt_cnt, rplt_trm = the visitor's inbound UTM values
 *   gclid, gbraid, wbraid, fbclid, msclkid, ttclid, twclid, li_fat_id, epik, rdt_cid, sccid
 *     = ad click ids, forwarded unchanged so ad platform conversion tags on the store can match them
 */

export const REFERRAL_STATIC = {
  utm_source: 'rpltusa',
  utm_medium: 'referral',
  utm_campaign: 'rpltusa_site',
  ref: 'rpltusa',
} as const

/** Inbound UTM keys and the names they are forwarded under */
export const INBOUND_UTM_MAP: Record<string, string> = {
  utm_source: 'rplt_src',
  utm_medium: 'rplt_med',
  utm_campaign: 'rplt_cmp',
  utm_content: 'rplt_cnt',
  utm_term: 'rplt_trm',
}

/** Ad platform click ids, forwarded under their original names */
export const CLICK_ID_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'dclid',
  'fbclid',
  'msclkid',
  'ttclid',
  'twclid',
  'li_fat_id',
  'epik',
  'rdt_cid',
  'sccid',
] as const

export type Placement
  = | 'header'
    | 'mobile_menu'
    | 'top_bar'
    | 'hero_primary'
    | 'hero_card'
    | 'product_card'
    | 'product_more'
    | 'catalog_all'
    | 'how_it_works'
    | 'quality'
    | 'faq'
    | 'cta_band'
    | 'sticky_mobile'
    | 'footer'
    | 'product_page_primary'
    | 'product_page_secondary'
    | 'product_page_related'
    | 'peptides_index'
    | 'not_found'

export interface ShopLinkOptions {
  placement: Placement
  /** RPLT USA peptide slug, sent as utm_term */
  product?: string
}

export const STORE_PATHS = {
  home: '/',
  catalog: '/products.html',
  contact: '/contact.html',
  product: (storeId: string) => `/product.html?id=${encodeURIComponent(storeId)}`,
} as const

/** Build a store URL carrying the static RPLT USA referral signature. */
export function buildShopUrl(shopOrigin: string, path: string, opts: ShopLinkOptions): string {
  const url = new URL(path, shopOrigin)
  for (const [key, value] of Object.entries(REFERRAL_STATIC))
    url.searchParams.set(key, value)
  url.searchParams.set('utm_content', opts.placement)
  if (opts.product)
    url.searchParams.set('utm_term', opts.product)
  return url.toString()
}

export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '')
}

export function isShopUrl(href: string, shopOrigin: string): boolean {
  try {
    return normalizeHost(new URL(href).hostname) === normalizeHost(new URL(shopOrigin).hostname)
  }
  catch {
    return false
  }
}

export interface StoredAttribution {
  /** Forwarded params, already renamed (rplt_src, gclid, ...) */
  params: Record<string, string>
  /** Landing path on RPLT USA for this touch */
  lp: string
  /** External referrer host, if any */
  ref?: string
  /** Epoch ms of the last update */
  ts: number
}

export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000

const MAX_PARAM_LENGTH = 200

function clean(value: string | null): string | undefined {
  if (!value)
    return undefined
  const trimmed = value.trim().slice(0, MAX_PARAM_LENGTH)
  return trimmed || undefined
}

/** Extract forwardable attribution from an inbound RPLT USA URL. */
export function readInboundParams(search: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [inbound, forwarded] of Object.entries(INBOUND_UTM_MAP)) {
    const value = clean(search.get(inbound))
    if (value)
      out[forwarded] = value
  }
  for (const key of CLICK_ID_KEYS) {
    const value = clean(search.get(key))
    if (value)
      out[key] = value
  }
  return out
}

/**
 * Merge visitor level attribution into a store URL. Never overwrites the static
 * referral signature, so the store always sees utm_source=rpltusa.
 */
export function decorateShopUrl(
  href: string,
  ctx: { visitorId?: string, page?: string, attribution?: StoredAttribution | null },
): string {
  const url = new URL(href)
  const setIfMissing = (key: string, value?: string) => {
    if (value && !url.searchParams.has(key))
      url.searchParams.set(key, value)
  }
  setIfMissing('rplt_vid', ctx.visitorId)
  if (ctx.page)
    url.searchParams.set('rplt_page', ctx.page)
  const attribution = ctx.attribution
  if (attribution) {
    setIfMissing('rplt_lp', attribution.lp)
    setIfMissing('rplt_ref', attribution.ref)
    for (const [key, value] of Object.entries(attribution.params))
      setIfMissing(key, value)
  }
  return url.toString()
}
