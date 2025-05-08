import { test, expect } from '@playwright/test'

test('headline', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('headline')).toHaveText('Welcome to Powerchart')
})
