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

test('add vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('checkbox-add-vat').check()

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('9.84')
  expect(page.url()).toBe('http://localhost:3000/table?vat=true')
})

test('deeplink with vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/table?vat=true')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('9.84')
})

test('remove vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table?vat=true')

  await page.getByTestId('checkbox-add-vat').uncheck()

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  expect(page.url()).toBe('http://localhost:3000/table')
})
