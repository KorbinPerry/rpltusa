import type { Page } from '@playwright/test'

export const SHOP_HOST = 'prolongevitypeptide.com'

export const PEPTIDE_SLUGS = [
  'tirzepatide',
  'semaglutide',
  'bpc-157',
  'ghk-cu',
  'tesamorelin',
  'tb-500',
  'cjc-1295-ipamorelin',
  'mots-c',
  'aod-9604',
  'ipamorelin',
  'epithalon',
]

/** Collect console errors and uncaught exceptions for a page. */
export function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error')
      errors.push(msg.text())
  })
  page.on('pageerror', err => errors.push(err.message))
  return errors
}

/** Answer store requests locally so tests never leave the machine, and record their URLs. */
export async function captureStoreNavigations(page: Page) {
  const urls: string[] = []
  for (const host of [SHOP_HOST, `www.${SHOP_HOST}`]) {
    await page.route(`**://${host}/**`, async (route) => {
      urls.push(route.request().url())
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>store</title><p>store</p>' })
    })
  }
  return urls
}

export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.8))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 80))
    }
  })
}
