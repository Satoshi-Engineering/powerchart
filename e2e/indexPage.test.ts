import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('price chart', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > *')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > *')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > *').nth(14)).toHaveText('18.12')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('14:00')
})

test('switch to summer time', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2024-03-31T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > *')).toHaveCount(23)
  await expect(page.getByTestId('bar-labels').locator(':scope > *')).toHaveCount(23)
  await expect(page.getByTestId('bar-labels').locator(':scope > *').nth(14)).toHaveText('14.78')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(0)).toHaveText('00:00 NZ')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('15:00 SZ')
})

test('return to standard time', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2024-10-27T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > *')).toHaveCount(25)
  await expect(page.getByTestId('bar-labels').locator(':scope > *')).toHaveCount(25)
  await expect(page.getByTestId('bar-labels').locator(':scope > *').nth(14)).toHaveText('21.08')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(0)).toHaveText('00:00 SZ')
  await expect(page.getByTestId('x-axis').locator(':scope > g').nth(14)).toHaveText('13:00 NZ')
})
