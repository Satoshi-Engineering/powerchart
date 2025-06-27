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

test('use a different electricity provider via ui', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  // for some reason the select does not open when clicking the button,
  // so we focus it and press enter
  await page.getByTestId('electricity-provider-select').focus()
  await page.keyboard.press('Enter')
  await page.getByRole('option', { name: 'SteirerStrom Spot' }).click()

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar_14:00').getByTestId('bar-total-price')).toHaveText('-0.89')
  await page.waitForURL('**/?selectedTariff=energie-steiermark-spot')
})

test('use a different electricity provider via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/?selectedTariff=energie-steiermark-spot')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()

  await expect(page.getByTestId('electricity-provider-select')).toContainText('SteirerStrom Spot')
  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar_14:00').getByTestId('bar-total-price')).toHaveText('-0.89')
})

test('use a another electricity provider via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/?selectedTariff=awattar-hourly')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar_14:00').getByTestId('bar-total-price')).toHaveText('-0.53')
})
