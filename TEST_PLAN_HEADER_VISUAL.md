# Header Visual Snapshot Test Plan

## Objective

Ensure the application chrome (header) renders consistently in light and dark themes with correct elevation states and active nav styling.

## Scenarios

1. Light theme, top of page (not scrolled): hairline visible, minimal shadow.
2. Light theme, after scroll (>8px): elevated shadow layers applied.
3. Dark theme, top of page.
4. Dark theme, after scroll.
5. Active navigation item state (sidebar) shows gradient + inset hairline.

## Implementation Sketch (Playwright)

```ts
// tests/visual/header.spec.ts
import { test, expect } from '@playwright/test'

async function gotoDashboard(page) {
  await page.goto('/dashboard')
  // Wait for header hydration (user data or static fallback)
  await page.waitForSelector('header.app-chrome [aria-label="Notifications"]')
}

test.describe('header visual', () => {
  test('light: top + scrolled', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await gotoDashboard(page)
    await expect(page.locator('header.app-chrome')).toHaveScreenshot('header-light-top.png')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(150)
    await expect(page.locator('header.app-chrome')).toHaveScreenshot('header-light-scrolled.png')
  })

  test('dark: top + scrolled', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await gotoDashboard(page)
    await expect(page.locator('header.app-chrome')).toHaveScreenshot('header-dark-top.png')
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(150)
    await expect(page.locator('header.app-chrome')).toHaveScreenshot('header-dark-scrolled.png')
  })
})
```

## Notes

- Use stable test account or mock user to avoid layout shift.
- Consider forcing reduced motion to avoid micro animation diffs.
- If sidebar animation causes flake, wait for `aside[role="complementary"]` settle or add class toggle event.
