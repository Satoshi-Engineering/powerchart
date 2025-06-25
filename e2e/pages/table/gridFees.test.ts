import { test, expect } from '@playwright/test'

import { dataApr7 } from '~~/e2e/mocks/data/2025-04-07'
import { dataApr8 } from '~~/e2e/mocks/data/2025-04-08'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

const currentDate = new Date('2025-04-08T10:00:00+02:00')

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataApr7, dataApr8)
})

test('no grid fees', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/table')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
})

test('select grid fees via ui', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  // for some reason the select does not open when clicking the button,
  // so we focus it and press enter
  await page.getByTestId('grid-fees-select').focus()
  await page.keyboard.press('Enter')
  await page.getByRole('option', { name: 'Steiermark Doppeltarif' }).click()

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('20.19')
  await page.waitForURL('**/table?selectedGrid=styriaDoubleTariff')
})

test('select grid fees via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/table?selectedGrid=styriaDoubleTariff')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('20.19')
})
