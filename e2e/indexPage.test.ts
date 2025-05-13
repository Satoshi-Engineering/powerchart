import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('price chart', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
  await expect(page.getByTestId('bar-group-power').locator(':scope > *')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > *')).toHaveCount(24)
  await expect(page.getByTestId('bar-labels').locator(':scope > *').nth(14)).toHaveText('18.12')
})
