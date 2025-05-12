import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('price chart', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')
  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
})
