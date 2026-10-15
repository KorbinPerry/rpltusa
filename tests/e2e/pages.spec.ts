import { expect, test } from '@playwright/test'
import { PEPTIDE_SLUGS, scrollThrough, trackErrors } from './helpers'

// Em dash, en dash, or any emoji (built from escapes so linters cannot rewrite it).
const FORBIDDEN_TEXT = new RegExp('[\\u2013\\u2014]|\\p{Extended_Pictographic}', 'u')

test('landing page renders cleanly', async ({ page }) => {
  const errors = trackErrors(page)
  const res = await page.goto('/', { waitUntil: 'networkidle' })
  expect(res?.status()).toBe(200)

  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toBeVisible()

  const title = await page.title()
  expect(title.length).toBeGreaterThan(10)
  expect(title.length).toBeLessThanOrEqual(65)
  expect(title).toContain('RPLT USA')

  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description?.length ?? 0).toBeGreaterThan(50)
  expect(description?.length ?? 0).toBeLessThanOrEqual(170)

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rpltusa.com/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://rpltusa.com/og/default.jpg')
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')

  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(() => JSON.parse(jsonLd || '')).not.toThrow()

  // All 11 peptides are on the page.
  await expect(page.locator('#best-sellers article')).toHaveCount(PEPTIDE_SLUGS.length)

  await scrollThrough(page)

  // Every image actually loads once it is scrolled into view.
  const broken = await page.evaluate(async () => {
    const failed: string[] = []
    for (const img of Array.from(document.images)) {
      img.scrollIntoView({ block: 'center' })
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
          setTimeout(resolve, 8000)
        })
      }
      if (img.naturalWidth === 0)
        failed.push(img.currentSrc || img.src)
    }
    return failed
  })
  expect(broken).toEqual([])

  // Copy rules: no em or en dashes, no emojis.
  const text = await page.evaluate(() => document.body.innerText)
  expect(text.match(FORBIDDEN_TEXT)?.[0]).toBeUndefined()

  expect(errors).toEqual([])
})

test('the site is a single page: every internal link stays on /', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const internal = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map(a => new URL(a.href))
      .filter(u => u.origin === window.location.origin)
      .map(u => u.pathname),
  )
  expect(new Set(internal)).toEqual(new Set(['/']))
})

test('no horizontal overflow and no clipped buttons', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const clipped = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('a, button'))
      .filter(el => el.offsetParent !== null && !el.classList.contains('sr-only'))
      .filter(el => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible')
      .map(el => el.textContent?.trim()),
  )
  expect(clipped).toEqual([])
})

test('terms and privacy open from their footer links', async ({ page }) => {
  await page.goto('/#privacy', { waitUntil: 'networkidle' })
  await expect(page.locator('#privacy')).toHaveAttribute('open', '')
  await expect(page.locator('#privacy')).toContainText('rplt_vid')

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.locator('#terms summary').click()
  await expect(page.locator('#terms')).toContainText('at least 18 years of age')
})

test('unknown paths return a branded 404', async ({ page }) => {
  for (const path of ['/peptides/bpc-157', '/does-not-exist']) {
    const res = await page.goto(path)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  }
})

test('robots and sitemap list the single page', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Allow: /')
  expect(robots).toContain('Sitemap: https://rpltusa.com/sitemap.xml')

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap.match(/<loc>https:\/\/rpltusa\.com[^<]*<\/loc>/g)).toEqual(['<loc>https://rpltusa.com/</loc>'])
  for (const slug of PEPTIDE_SLUGS)
    expect(sitemap).toContain(`https://rpltusa.com/images/peptides/${slug}.webp`)
})

test('catalog API always answers with the full lineup', async ({ request }) => {
  const res = await request.get('/api/catalog')
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(['live', 'snapshot']).toContain(body.source)
  expect(body.items.map((i: { slug: string }) => i.slug).sort()).toEqual([...PEPTIDE_SLUGS].sort())
  for (const item of body.items) {
    expect(item.price).toBeGreaterThan(0)
    expect(item.size).toMatch(/^\d+(mg|ml)$/)
  }
})
