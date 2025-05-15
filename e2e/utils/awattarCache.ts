import { request } from 'playwright-core'

import type { AwattarPrice } from '~~/shared/data/AwattarPrice'

export const prepareAwattarCache = async (...prices: AwattarPrice[][]) => {
  const apiContext = await request.newContext()
  await flushAwattarCache()
  for (const data of prices) {
    const first = data[0]
    if (first == null) {
      continue
    }
    await apiContext.post('http://localhost:3050/mock/setdata', {
      data: {
        start: String(first.start_timestamp),
        data,
      },
    })
  }
}

export const flushAwattarCache = async () => {
  const apiContext = await request.newContext()
  await apiContext.post('http://localhost:3000/api/flush-awattar-cache')
}
