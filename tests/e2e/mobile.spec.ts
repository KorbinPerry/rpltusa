import { expect, test } from '@playwright/test'
import { captureStoreNavigations } from './helpers'

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('menu opens, links work and the store button is decorated', async ({ page }) => {
    const navigations = await captureStoreNavigations(page)
    await page.goto('/', { waitUntil: 'networkidle' })
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
    await expect(menu.getByRole('link', { name: 'FAQ' })).toBeVisible()

    // Escape closes and returns focus to the toggle.
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()

    await page.getByRole('button', { name: 'Open menu' }).click()
    await menu.getByRole('link', { name: 'Shop all peptides' }).click()
    await expect.poll(() => navigations.length).toBeGreaterThan(0)
    const url = new URL(navigations.at(-1)!)
    expect(url.searchParams.get('utm_content')).toBe('mobile_menu')
    expect(url.searchParams.get('rplt_vid')).toMatch(/^v[0-9a-f]{16}$/)
  })

  test('menu anchor link scrolls to the section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.locator('#mobile-menu').getByRole('link', { name: 'FAQ' }).click()
    await expect(page.locator('#mobile-menu')).toBeHidden()
    await expect(page.locator('#faq')).toBeInViewport()
  })

  test('sticky shop bar appears after scrolling and links to the product', async ({ page }) => {
    const navigations = await captureStoreNavigations(page)
    await page.goto('/peptides/ghk-cu', { waitUntil: 'networkidle' })
    const bar = page.getByTestId('sticky-shop-bar')
    await expect(bar).toHaveAttribute('aria-hidden', 'true')

    await page.mouse.wheel(0, 1400)
    await expect(bar).toHaveAttribute('aria-hidden', 'false')
    await bar.getByRole('link').click()
    await expect.poll(() => navigations.length).toBeGreaterThan(0)
    const url = new URL(navigations.at(-1)!)
    expect(url.pathname).toBe('/product.html')
    expect(url.searchParams.get('id')).toBe('ghk-cu')
    expect(url.searchParams.get('utm_content')).toBe('sticky_mobile')
  })

  test('tap targets are at least 40px tall', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('main a[href*="prolongevitypeptide.com"]'))
        .filter(el => el.offsetParent !== null)
        .filter(el => el.getBoundingClientRect().height < 40 && !el.closest('p'))
        .map(el => el.textContent?.trim()),
    )
    expect(small).toEqual([])
  })
})
