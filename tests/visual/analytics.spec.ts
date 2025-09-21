import { test, expect } from '@playwright/test'

// Visual regression for analytics page (multi-card layout) using same stabilization tricks as design-system test

test.describe.skip('Analytics Page (temporarily skipped pending stable auth)', () => {
  test('captures analytics snapshot', async ({ page }) => {
  await page.goto('/dashboard/analytics', { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(150)
  // Accept either 'Usage & Analytics' heading or any element containing 'Analytics'
    // Attempt to wait for the heading; swallow timeout to allow snapshot even if text changes
    try {
      const heading = page.getByRole('heading', { name: 'Usage Analytics' })
      await heading.waitFor({ state: 'visible', timeout: 8000 })
    } catch {}
  await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; } [class*="fixed"][class*="bottom-4"][class*="right-4"] { display:none !important; }' })
  const target = page.locator('body')
  await expect(target).toHaveScreenshot('analytics.png', { animations: 'disabled', timeout: 15000 })
  })
})
