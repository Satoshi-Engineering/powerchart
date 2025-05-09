import { test, expect } from '@playwright/test'

test('price chart', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('electricity-price-chart')).toBeVisible()
})
