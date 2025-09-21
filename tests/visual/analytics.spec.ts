import { test, expect } from '@playwright/test'

// Visual regression for analytics page (multi-card layout) using same stabilization tricks as design-system test

test.describe('Analytics Page', () => {
  test('captures analytics snapshot', async ({ page }) => {
  await page.goto('/dashboard/analytics', { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(150)
  await page.getByText(/analytics/i).first().waitFor({ state: 'visible', timeout: 10000 })
  await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; } [class*="fixed"][class*="bottom-4"][class*="right-4"] { display:none !important; }' })
  const target = page.locator('body')
  await expect(target).toHaveScreenshot('analytics.png', { animations: 'disabled', timeout: 15000 })
  })
})
