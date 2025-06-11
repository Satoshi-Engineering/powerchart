import { test, expect } from '@playwright/test'

import { gotoAndWaitForNuxtHydration } from '~~/e2e/utils/page'

test.use({
  timezoneId: 'Europe/Vienna',
})

test('navigate to table page', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.getByTestId('layout-nav-menu').locator('a[href="/table"]').click()

  await expect(page.getByTestId('page-table')).toBeVisible()
  expect(page.url()).toContain('/table')
})

test('navigate back to index page', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.getByTestId('layout-nav-menu').locator('a[href="/table"]').click()
  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.getByTestId('layout-nav-menu').locator('a[href="/"]').click()

  await expect(page.getByTestId('page-index')).toBeVisible()
  expect(page.url()).not.toContain('/table')
})

test('navigation should keep settings in url', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/?selectedTariff=energie-steiermark-spot')

  await page.getByTestId('layout-header').locator('button[aria-label="Open menu"]').click()
  await page.getByTestId('layout-nav-menu').locator('a').nth(1).click()

  await expect(page.getByTestId('page-table')).toBeVisible()
  expect(page.url()).toContain('/table?selectedTariff=energie-steiermark-spot')
})

test('navigation to "home" should clear settings', async ({ page }) => {
  await gotoAndWaitForNuxtHydration(page, '/table?selectedTariff=energie-steiermark-spot')

  await page.getByTestId('layout-header-logo').click()

  await expect(page.getByTestId('page-index')).toBeVisible()
  expect(page.url()).not.toContain('selectedTariff=energie-steiermark-spot')
})
