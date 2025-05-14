import { test, expect } from '@playwright/test'

import fees from '~~/app/assets/fees.json' with { type: 'json' }
import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test('all fee segments are displayed', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-group-salesTax').locator(':scope > rect')).toHaveCount(24)
  for (const fee of fees) {
    await expect(page.getByTestId(`bar-group-${fee.id}`).locator(':scope > rect')).toHaveCount(24)
  }
})

test('no infrastructure fee', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2025-05-12T10:00:00'))

  await gotoAndWaitForNuxtHydration(page, '/?excludeFees=electricityFee')

  await expect(page.getByTestId('bar-group-power').locator(':scope > rect')).toHaveCount(24)
  await expect(page.getByTestId('bar-group-salesTax').locator(':scope > rect')).toHaveCount(24)
  for (const fee of fees) {
    if (fee.id === 'electricityFee') {
      await expect(page.getByTestId(`bar-group-${fee.id}`)).not.toBeVisible()
    } else {
      await expect(page.getByTestId(`bar-group-${fee.id}`).locator(':scope > rect')).toHaveCount(24)
    }
  }
})
