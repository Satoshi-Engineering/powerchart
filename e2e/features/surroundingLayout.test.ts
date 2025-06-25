import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test('surrounding layout', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  await expect(page.getByTestId('the-default-layout')).toHaveCount(1)
  await expect(page.getByTestId('layout-header')).toHaveCount(1)
  await expect(page.getByTestId('layout-main')).toHaveCount(1)
  await expect(page.getByTestId('layout-footer')).toHaveCount(1)
})

test('disable surrounding layout via ui', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.waitForTimeout(300)
  await page.getByTestId('disable-surrounding-layout-checkbox').click()

  await expect(page.getByTestId('the-default-layout')).toHaveCount(0)
  await expect(page.getByTestId('layout-header')).toHaveCount(0)
  await expect(page.getByTestId('layout-main')).toHaveCount(0)
  await expect(page.getByTestId('layout-footer')).toHaveCount(0)
  expect(page.url()).toContain('disableSurroundingLayout=true')
})

test('disable surrounding layout via url', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table?disableSurroundingLayout=true')

  await expect(page.getByTestId('the-default-layout')).toHaveCount(0)
  await expect(page.getByTestId('layout-header')).toHaveCount(0)
  await expect(page.getByTestId('layout-main')).toHaveCount(0)
  await expect(page.getByTestId('layout-footer')).toHaveCount(0)
})
