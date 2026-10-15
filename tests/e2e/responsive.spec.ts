import { expect, test } from '@playwright/test'

const WIDTHS = [320, 360, 375, 390, 414, 430, 768]

/**
 * Layout guard for phones and small tablets. Fails on horizontal scroll, text spilling
 * out of its box, controls or prices wrapping onto a second line, misaligned hero
 * stats, and product names breaking at a hyphen (for example "CJC-" / "1295").
 */
test.describe('responsive layout', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  for (const width of WIDTHS) {
    test(`clean layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
          window.scrollTo({ top: y, behavior: 'instant' })
          await new Promise(r => setTimeout(r, 40))
        }
        window.scrollTo({ top: 0, behavior: 'instant' })
      })

      const issues = await page.evaluate(() => {
        const found: string[] = []
        const visible = (el: Element) => (el as HTMLElement).offsetParent !== null && !el.closest('.sr-only, [aria-hidden="true"], [aria-live]')
        // Count visual lines: text boxes that overlap vertically sit on the same line,
        // even when font sizes differ (for example "$215" next to a smaller "USD").
        const countLines = (rects: DOMRect[]) => {
          const sorted = rects.filter(r => r.width > 1).sort((a, b) => a.top - b.top)
          let lines = 0
          let bottom = Number.NEGATIVE_INFINITY
          for (const r of sorted) {
            if (r.top >= bottom - 2) {
              lines++
              bottom = r.bottom
            }
            else {
              bottom = Math.max(bottom, r.bottom)
            }
          }
          return lines
        }
        const lineTops = (el: Element) => {
          const rects: DOMRect[] = []
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
          let node: Node | null
          while ((node = walker.nextNode())) {
            if (!node.textContent?.trim() || node.parentElement?.closest('.sr-only'))
              continue
            const range = document.createRange()
            range.selectNodeContents(node)
            rects.push(...Array.from(range.getClientRects()))
          }
          return countLines(rects)
        }

        if (document.documentElement.scrollWidth > window.innerWidth)
          found.push(`horizontal scroll: ${document.documentElement.scrollWidth}px`)

        for (const el of Array.from(document.querySelectorAll('main *, header *, footer *'))) {
          if (!visible(el) || ['IMG', 'svg', 'path'].includes(el.tagName))
            continue
          const style = getComputedStyle(el)
          if (style.overflowX !== 'visible' && style.overflowX !== 'auto' && el.scrollWidth > el.clientWidth + 1)
            found.push(`text overflow: "${el.textContent?.trim().slice(0, 40)}"`)
        }

        const singleLine = 'a[data-slot="base"], button:not(#faq button), main dl dd, main dl dt, article p.whitespace-nowrap, article span.uppercase, header nav a, #mobile-menu a'
        for (const el of Array.from(document.querySelectorAll(singleLine))) {
          if (visible(el) && lineTops(el) > 1)
            found.push(`wraps: "${el.textContent?.trim().slice(0, 40)}"`)
        }

        for (const el of Array.from(document.querySelectorAll('article h3 + p'))) {
          if (lineTops(el) > 2)
            found.push(`tagline over 2 lines: "${el.textContent?.trim()}"`)
        }

        const statTops = Array.from(document.querySelectorAll('main dl dd'), dd => Math.round(dd.getBoundingClientRect().top))
        if (new Set(statTops).size !== 1)
          found.push(`hero stats misaligned: ${statTops.join(',')}`)

        // Hyphenated product names must never split across lines.
        const names = /\b(?:BPC-157|TB-500|GHK-Cu|CJC-1295|MOTS-c|AOD-9604|SS-31|PT-141)\b/g
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let node: Node | null
        while ((node = walker.nextNode())) {
          const text = node.textContent || ''
          if (!node.parentElement || !visible(node.parentElement))
            continue
          for (const match of text.matchAll(names)) {
            const range = document.createRange()
            range.setStart(node, match.index!)
            range.setEnd(node, match.index! + match[0].length)
            if (countLines(Array.from(range.getClientRects())) > 1)
              found.push(`name split across lines: ${match[0]}`)
          }
        }
        return found
      })

      expect(issues).toEqual([])
    })
  }
})
