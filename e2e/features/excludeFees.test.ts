import { test, expect } from '@playwright/test'

import { dataMay11 } from '~~/e2e/mocks/data/2025-05-11'
import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

const currentDate = new Date('2025-05-12T10:00:00+02:00')

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataMay11, dataMay12)
})

test('all fee segments are displayed', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(7)
  await expect(page.getByTestId('bar_09:00').getByTestId('bar-segment-electricityFee')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-electricityFee')).toHaveCount(24)
})

test('no infrastructure fee', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/?excludeFees=electricityFee')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(6)
  await expect(page.getByTestId('bar-segment-electricityFee')).toHaveCount(0)
})
