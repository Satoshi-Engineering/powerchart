import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('negative prices are displayed', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-11T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-group-power').locator(':scope > rect').nth(13)).toHaveAttribute('height', '0')
  await expect(page.getByTestId('bar-group-negative-power').locator(':scope > rect')).toHaveCount(7)
})
