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

test('no vat', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-vat')).toHaveCount(0)
})

test('add vat via ui', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  await page.getByTestId('add-vat-checkbox').check()

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(2)
  await expect(page.getByTestId('bar_09:00').getByTestId('bar-segment-vat')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-vat')).toHaveCount(20)
  expect(page.url()).toContain('addVat=true')
})

test('add vat via url', async ({ page }) => {
  await page.clock.setFixedTime(currentDate)

  await gotoAndWaitForNuxtHydration(page, '/?addVat=true')

  await expect(page.getByTestId('bar_09:00').locator(':scope > rect')).toHaveCount(2)
  await expect(page.getByTestId('bar_09:00').getByTestId('bar-segment-vat')).toHaveCount(1)
  await expect(page.getByTestId('bar-segment-vat')).toHaveCount(20)
})
