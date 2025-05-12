import type { Page } from 'playwright-core'

export const gotoAndWaitForNuxtHydration = async (page: Page, url: string) => {
  await page.goto(url)
  await page.waitForFunction(() => window.useNuxtApp?.().isHydrating === false)
}
