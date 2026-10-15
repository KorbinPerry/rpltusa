import { expect, test } from '@playwright/test'
import { captureStoreNavigations, PAGES, SHOP_HOST } from './helpers'

const STORE_ID: Record<string, string> = { 'cjc-1295-ipamorelin': 'cjc-1295' }

function isStore(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '') === SHOP_HOST
  }
  catch {
    return false
  }
}

test('every store link carries the RPLT USA referral signature', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]'), a => (a as HTMLAnchorElement).href))
    const storeLinks = hrefs.filter(isStore)
    expect(storeLinks.length, `store links on ${path}`).toBeGreaterThan(0)

    for (const href of storeLinks) {
      const url = new URL(href)
      expect(url.protocol).toBe('https:')
      expect(url.searchParams.get('utm_source'), href).toBe('rpltusa')
      expect(url.searchParams.get('utm_medium'), href).toBe('referral')
      expect(url.searchParams.get('utm_campaign'), href).toBe('rpltusa_site')
      expect(url.searchParams.get('ref'), href).toBe('rpltusa')
      expect(url.searchParams.get('utm_content'), href).toMatch(/^[a-z_]+$/)
      if (url.pathname === '/product.html') {
        const term = url.searchParams.get('utm_term')
        expect(term, href).toBeTruthy()
        expect(url.searchParams.get('id')).toBe(STORE_ID[term!] || term)
      }
    }

    // Product pages send the primary call to action to that exact product.
    const slug = path.match(/^\/peptides\/(.+)$/)?.[1]
    if (slug) {
      const primary = page.getByRole('link', { name: /^Buy / }).first()
      const url = new URL((await primary.getAttribute('href'))!)
      expect(url.pathname).toBe('/product.html')
      expect(url.searchParams.get('id')).toBe(STORE_ID[slug] || slug)
      expect(url.searchParams.get('utm_content')).toBe('product_page_primary')
      expect(url.searchParams.get('utm_term')).toBe(slug)
    }
  }
})

test('store links do not strip the referrer', async ({ page }) => {
  await page.goto('/')
  const rels = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="prolongevitypeptide.com"]'), a => a.getAttribute('rel') || ''),
  )
  for (const rel of rels)
    expect(rel).not.toContain('noreferrer')
})

test('click adds visitor id, page, campaign pass through and ad click ids', async ({ page }) => {
  const navigations = await captureStoreNavigations(page)
  await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=fall_launch&utm_term=bpc%20157&gclid=TEST-GCLID-123&fbclid=FB-1', { waitUntil: 'networkidle' })

  await page.getByRole('link', { name: 'Shop research peptides' }).first().click()
  await expect.poll(() => navigations.length).toBeGreaterThan(0)

  const url = new URL(navigations.at(-1)!)
  expect(url.hostname.replace(/^www\./, '')).toBe(SHOP_HOST)
  expect(url.pathname).toBe('/products.html')
  // Static signature is never overwritten by inbound values.
  expect(url.searchParams.get('utm_source')).toBe('rpltusa')
  expect(url.searchParams.get('utm_medium')).toBe('referral')
  expect(url.searchParams.get('utm_campaign')).toBe('rpltusa_site')
  expect(url.searchParams.get('utm_content')).toBe('hero_primary')
  expect(url.searchParams.get('ref')).toBe('rpltusa')
  // Visitor level data.
  expect(url.searchParams.get('rplt_vid')).toMatch(/^v[0-9a-f]{16}$/)
  expect(url.searchParams.get('rplt_page')).toBe('/')
  expect(url.searchParams.get('rplt_lp')).toBe('/')
  expect(url.searchParams.get('rplt_src')).toBe('google')
  expect(url.searchParams.get('rplt_med')).toBe('cpc')
  expect(url.searchParams.get('rplt_cmp')).toBe('fall_launch')
  expect(url.searchParams.get('rplt_trm')).toBe('bpc 157')
  expect(url.searchParams.get('gclid')).toBe('TEST-GCLID-123')
  expect(url.searchParams.get('fbclid')).toBe('FB-1')
})

test('attribution persists across pages and visits with a stable visitor id', async ({ page }) => {
  const navigations = await captureStoreNavigations(page)
  await page.goto('/peptides/tirzepatide?utm_source=newsletter&utm_campaign=oct&msclkid=MS-9', { waitUntil: 'networkidle' })

  // A later, direct visit to another page keeps the campaign.
  await page.goto('/peptides/bpc-157', { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: /^Buy BPC-157/ }).first().click()
  await expect.poll(() => navigations.length).toBeGreaterThan(0)
  const first = new URL(navigations.at(-1)!)
  expect(first.pathname).toBe('/product.html')
  expect(first.searchParams.get('id')).toBe('bpc-157')
  expect(first.searchParams.get('rplt_page')).toBe('/peptides/bpc-157')
  expect(first.searchParams.get('rplt_lp')).toBe('/peptides/tirzepatide')
  expect(first.searchParams.get('rplt_src')).toBe('newsletter')
  expect(first.searchParams.get('rplt_cmp')).toBe('oct')
  expect(first.searchParams.get('msclkid')).toBe('MS-9')
  const vid = first.searchParams.get('rplt_vid')
  expect(vid).toMatch(/^v[0-9a-f]{16}$/)

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: 'Shop all peptides' }).first().click()
  await expect.poll(() => navigations.length).toBeGreaterThan(1)
  const second = new URL(navigations.at(-1)!)
  expect(second.searchParams.get('rplt_vid')).toBe(vid)
  expect(second.searchParams.get('utm_content')).toBe('cta_band')
})

test('works with storage blocked', async ({ browser }) => {
  const context = await browser.newContext()
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked')
      },
    })
  })
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  const navigations = await captureStoreNavigations(page)
  await page.goto('/?utm_source=x', { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: 'Shop research peptides' }).first().click()
  await expect.poll(() => navigations.length).toBeGreaterThan(0)
  const url = new URL(navigations.at(-1)!)
  expect(url.searchParams.get('utm_source')).toBe('rpltusa')
  expect(url.searchParams.get('rplt_vid')).toMatch(/^v[0-9a-f]{16}$/)
  expect(url.searchParams.get('rplt_src')).toBe('x')
  expect(errors).toEqual([])
  await context.close()
})
