import { DateTime } from 'luxon'
import { z } from 'zod'

import { AwattarPrice } from '~~/shared/data/AwattarPrice'

const config = useRuntimeConfig()

/**
 * @param dateIso day formatted as YYYY-MM-DD
 */
export const loadAwattarPrices = async (dateIso: string): Promise<AwattarPricesResponse['data']> => {
  const data = cache.safeGetValue(dateIso)
  if (data) {
    return data
  }
  return await fetchPrices(dateIso)
}

export const flushCache = (): void => {
  cache.clearAllValues()
}

const AwattarPricesResponse = z.object({
  object: z.literal('list'),
  data: AwattarPrice.array(),
  url: z.string(),
})

const { cache } = useInMemoryCache<AwattarPricesResponse['data']>()

type AwattarPricesResponse = z.infer<typeof AwattarPricesResponse>

const fetchPrices = async (dateIso: string): Promise<AwattarPricesResponse['data']> => {
  try {
    const data = await fetchPricesFromAwattar(dateIso)
    updateCache(dateIso, data, data.length > 0)
    return data
  } catch (error) {
    return handleFailedFetch(dateIso, error)
  }
}

const fetchPricesFromAwattar = async (dateIso: string): Promise<AwattarPricesResponse['data']> => {
  const url = buildUrl(dateIso)
  const response = await fetchWithRateLimiting(
    url,
    AwattarPricesResponse,
  )
  return response.data
}

const buildUrl = (dateIso: string) => {
  const targetDate = DateTime.fromISO(dateIso).startOf('day')
  const start = targetDate.toMillis()
  const end = targetDate.plus({ days: 1 }).toMillis()
  return `${config.awattarApiOrigin}/v1/marketdata?start=${start}&end=${end}`
}

const updateCache = (
  dateIso: string,
  data: AwattarPricesResponse['data'],
  isDataAvailable: boolean = false,
) => {
  cache.cacheValue(dateIso, data, {
    forMS: isDataAvailable ? 1_000 * 60 * 5 : 1_000 * 60,
  })
}

const handleFailedFetch = (dateIso: string, error: unknown) => {
  const data = cache.safeGetExpiredValue(dateIso)

  // updating the cache prevents the fetch from being retried too often
  updateCache(dateIso, data ?? [])
  if (data) {
    return data
  }

  console.error(`Failed to fetch prices from awattar for ${dateIso} and no cached data is available.`, error)
  throw error
}
