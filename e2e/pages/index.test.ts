import { test, expect } from '@playwright/test'

import { dataMarch31 } from '~~/e2e/mocks/data/2024-03-31'
import { dataOctober27 } from '~~/e2e/mocks/data/2024-10-27'
import { dataMay11 } from '~~/e2e/mocks/data/2025-05-11'
import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(
    dataMarch31, dataOctober27,
    dataMay11, dataMay12,
  )
})

test('price chart', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > text')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > text').nth(14)).toHaveText('18.12')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('14:00')
})

test('switch to summer time', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2024-03-31T10:00:00+02:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(23)
  await expect(page.getByTestId('bar-labels').locator(':scope > text')).toHaveCount(23)
  await expect(page.getByTestId('bar-labels').locator(':scope > text').nth(14)).toHaveText('14.78')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(0)).toHaveText('00:00 NZ')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('15:00 SZ')
})

test('return to standard time', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2024-10-27T10:00:00+01:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(25)
  await expect(page.getByTestId('bar-labels').locator(':scope > text')).toHaveCount(25)
  await expect(page.getByTestId('bar-labels').locator(':scope > text').nth(14)).toHaveText('21.08')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(0)).toHaveText('00:00 SZ')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('13:00 NZ')
})
