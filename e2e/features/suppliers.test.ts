import { test, expect } from '@playwright/test'

import fees from '~~/app/assets/fees.json' with { type: 'json' }
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

test('use a different electricity supplier', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/awattar/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > text')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > text').nth(14)).toHaveText('11.95')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('14:00')
})

test('for a different electricity supplier the infrastructure fee is excluded', async ({ page }) => {
  // the default setting is for johannes electric car filling station and the infrastructure fee is only relevant for that station
  // with a different electricity supplier the cart is not used for the filling station, so the fee is not applicable
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/?excludeFees=infrastructureFee')

  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-group-salesTax').locator(':scope > rect')).toHaveCount(24)
  for (const fee of fees) {
    if (fee.id === 'infrastructureFee') {
      await expect(page.getByTestId(`bar-group-${fee.id}`)).not.toBeVisible()
    } else {
      await expect(page.getByTestId(`bar-group-${fee.id}`).locator(':scope > rect')).toHaveCount(24)
    }
  }
})
