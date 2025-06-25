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

test('no grid fees', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-gridFee')).toHaveCount(0)
})

test('select grid fees via ui', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  // for some reason the select does not open when clicking the button,
  // so we focus it and press enter
  await page.getByTestId('grid-fees-select').focus()
  await page.keyboard.press('Enter')
  await page.getByRole('option', { name: 'Steiermark Doppeltarif' }).click()

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(5)
  await expect(page.getByTestId('bar_09:00').getByTestId('bar-segment-gridFee')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-gridFee')).toHaveCount(24)
  expect(page.url()).toContain('selectedGrid=styriaDoubleTariff')
})

test('select grid fees via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/?selectedGrid=styriaDoubleTariff')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(5)
  await expect(page.getByTestId('bar_09:00').getByTestId('bar-segment-gridFee')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-gridFee')).toHaveCount(24)
})
