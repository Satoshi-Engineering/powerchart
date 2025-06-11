import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  locale: 'en-US',
  timezoneId: 'Europe/Vienna',
})

test('default language', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('switch to german', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('button-lang-switch').click()
  await page.locator('a:has-text("Deutsch")').click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  expect(page.url()).toContain('/de/table')
})

test('deeplink to german', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/de/table')

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
})
