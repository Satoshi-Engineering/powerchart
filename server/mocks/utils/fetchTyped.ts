import { vi } from 'vitest'

export const fetchTyped = vi.fn(() => ({ data: 'mocked data' }))

vi.stubGlobal('fetchTyped', fetchTyped)

/*
I tried this, but it does not work:

import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('fetchTyped', () => async () => ({
  data: 'mocked data',
}))
*/
