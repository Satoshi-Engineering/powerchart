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

test('add vat via ui', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  await page.getByTestId('add-vat-checkbox').check()

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('9.84')
  await page.waitForURL('**/table?addVat=true')
})

test('deeplink with vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/table?addVat=true')

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('9.84')
})

test('remove vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/table?addVat=true')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  await page.getByTestId('add-vat-checkbox').uncheck()

  await expect(page.locator('[data-testid="price-item"][data-test-day="current"][data-test-hour="10"]')).toHaveText('8.20')
  await page.waitForURL('**/table')
})
