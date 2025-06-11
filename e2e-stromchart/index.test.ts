import { test, expect } from '@playwright/test'

import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataMay12)
})

test('price chart', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-segment-price')).toHaveCount(23)
  await expect(page.getByTestId('bar-segment-negative-price')).toHaveCount(1)
  await expect(page.getByTestId('bar-total-price')).toHaveCount(24)
  await expect(page.getByTestId('bar-total-price').nth(14)).toHaveText('18.12')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('14:00')
})

test('no surrounding layout', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('app-layout')).toHaveCount(0)
  await expect(page.locator('header')).toHaveCount(0)
  await expect(page.getByTestId('app-main')).toHaveCount(0)
  await expect(page.getByTestId('app-footer')).toHaveCount(0)
})
