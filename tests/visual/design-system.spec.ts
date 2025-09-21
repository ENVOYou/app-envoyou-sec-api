import { test, expect } from '@playwright/test'

// Simple smoke + screenshot test for design system showcase
// Run server separately: pnpm run dev (in another terminal) or use a start-server script.

test.describe('Design System Page', () => {
  test('captures layout snapshot', async ({ page }) => {
    await page.goto('/design-system')
    await page.getByText('Design System').waitFor()
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' })
    // Hide toast container if present
    await page.addStyleTag({ content: '[class*="fixed"][class*="bottom-4"][class*="right-4"] { display: none !important; }' })
    const root = page.getByTestId('design-system-root')
    await expect(root).toHaveScreenshot('design-system.png', { animations: 'disabled' })
  })
})
