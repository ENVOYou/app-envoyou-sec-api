import { test, expect, Page } from '@playwright/test'

async function goto(page: Page) {
  await page.goto('/design-system/header-preview')
  await page.waitForSelector('header.app-chrome [aria-label="Notifications"]')
}

async function screenshotHeader(page: Page, name: string) {
  const header = page.locator('header.app-chrome')
  await expect(header).toBeVisible()
  await expect(header).toHaveScreenshot(name, { animations: 'disabled' })
}

test.describe('header visual', () => {
  test('light top + scrolled', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await goto(page)
    await screenshotHeader(page, 'header-light-top.png')
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(120)
    await screenshotHeader(page, 'header-light-scrolled.png')
  })

  test('dark top + scrolled', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await goto(page)
    await screenshotHeader(page, 'header-dark-top.png')
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(120)
    await screenshotHeader(page, 'header-dark-scrolled.png')
  })
})
