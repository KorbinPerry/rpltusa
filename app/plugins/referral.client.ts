import {
  ATTRIBUTION_TTL_MS,
  decorateShopUrl,
  isShopUrl,
  normalizeHost,
  readInboundParams,
  type StoredAttribution,
} from '#shared/referral'

const VISITOR_KEY = 'rplt_vid'
const ATTRIBUTION_KEY = 'rplt_attr'

declare global {
  interface Window {
    va?: (event: 'event', payload: { name: string, data?: Record<string, string> }) => void
    dataLayer?: Record<string, unknown>[]
  }
}

function safeStorage(): Storage | null {
  try {
    const probe = '__rplt__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return window.localStorage
  }
  catch {
    return null
  }
}

function randomId(): string {
  const bytes = new Uint8Array(8)
  window.crypto.getRandomValues(bytes)
  return 'v' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Appends the visitor level referral signature to every store link at the moment it
 * is used (click, middle click, open in new tab). Static UTMs are already in the HTML.
 */
export default defineNuxtPlugin(() => {
  const { shopUrl } = useRuntimeConfig().public
  const storage = safeStorage()

  // Visitor id: stable per browser, falls back to a per page id when storage is blocked.
  let visitorId = storage?.getItem(VISITOR_KEY) || ''
  if (!/^v[0-9a-f]{16}$/.test(visitorId)) {
    visitorId = randomId()
    storage?.setItem(VISITOR_KEY, visitorId)
  }

  // Attribution: last touch with any campaign data wins, kept for 30 days.
  let attribution: StoredAttribution | null = null
  try {
    const raw = storage?.getItem(ATTRIBUTION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAttribution
      if (parsed && typeof parsed.ts === 'number' && Date.now() - parsed.ts < ATTRIBUTION_TTL_MS)
        attribution = parsed
    }
  }
  catch {
    attribution = null
  }

  const inbound = readInboundParams(new URLSearchParams(window.location.search))
  let externalRef: string | undefined
  try {
    if (document.referrer) {
      const refHost = normalizeHost(new URL(document.referrer).hostname)
      if (refHost && refHost !== normalizeHost(window.location.hostname))
        externalRef = refHost
    }
  }
  catch {
    externalRef = undefined
  }

  // A new campaign or external referral replaces the previous touch (last non direct touch).
  const hasNewTouch = Object.keys(inbound).length > 0 || Boolean(externalRef)
  if (!attribution || hasNewTouch) {
    attribution = {
      params: inbound,
      lp: window.location.pathname,
      ref: externalRef,
      ts: Date.now(),
    }
    try {
      storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution))
    }
    catch {
      // Storage full or blocked; attribution still applies for this page view.
    }
  }

  const decorate = (anchor: HTMLAnchorElement) => {
    if (!anchor.href || !isShopUrl(anchor.href, shopUrl))
      return null
    const next = decorateShopUrl(anchor.href, {
      visitorId,
      page: window.location.pathname,
      attribution,
    })
    if (next !== anchor.href)
      anchor.href = next
    return new URL(next)
  }

  const findAnchor = (event: Event) => {
    const target = event.target as Element | null
    return target?.closest?.('a[href]') as HTMLAnchorElement | null
  }

  const onActivate = (event: Event) => {
    const anchor = findAnchor(event)
    if (!anchor)
      return
    const url = decorate(anchor)
    if (!url || event.type !== 'click')
      return
    const data = {
      placement: url.searchParams.get('utm_content') || 'unknown',
      product: url.searchParams.get('utm_term') || 'none',
      page: window.location.pathname,
    }
    try {
      window.va?.('event', { name: 'Shop Click', data })
      window.dataLayer?.push({ event: 'rplt_shop_click', ...data })
    }
    catch {
      // Analytics must never block navigation.
    }
  }

  for (const type of ['click', 'auxclick', 'contextmenu'])
    document.addEventListener(type, onActivate, { capture: true })
  // Keyboard activation fires click; touch long press on some browsers only fires touchstart.
  document.addEventListener('touchstart', onActivate, { capture: true, passive: true })

  return {
    provide: {
      referral: { visitorId, attribution: () => attribution },
    },
  }
})
