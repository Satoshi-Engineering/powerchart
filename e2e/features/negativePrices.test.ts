import { test, expect } from '@playwright/test'

import { dataMay11 } from '~~/e2e/mocks/data/2025-05-11'
import { dataMay12 } from '~~/e2e/mocks/data/2025-05-12'
import { prepareAwattarCache } from '~~/e2e/utils/awattarCache'
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

const currentDate = new Date('2025-05-11T10:00:00+02:00')

test.use({
  timezoneId: 'Europe/Vienna',
})

test.beforeAll(async () => {
  await prepareAwattarCache(dataMay11, dataMay12)
})

test('negative prices are displayed', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect').nth(13)).toHaveAttribute('height', '0')
  await expect(page.getByTestId('bar-group-negative-power').locator(':scope > rect')).toHaveCount(7)
})
