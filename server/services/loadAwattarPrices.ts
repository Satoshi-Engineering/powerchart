import axios from 'axios'
import { DateTime } from 'luxon'
import { z } from 'zod'

import { AwattarPrice } from '~~/shared/data/AwattarPrice'

/**
 * @param dateIso day formatted as YYYY-MM-DD
 */
export const loadAwattarPrices = async (dateIso: string): Promise<AwattarPricesResponse['data']> => {
  const data = cache.safeGetValue(dateIso)
  if (data) {
    return data
  }
  try {
    const data = await fetchPricesFromAwattar(dateIso)
    cache.cacheValue(dateIso, data, { forMS: 1_000 * 5 })
    return data
  } catch (error) {
    console.error('Failed to fetch prices from awattar', error)
    const data = cache.safeGetExpiredValue(dateIso)
    if (data) {
      return data
    }
    throw error
  }
}

const AwattarPricesResponse = z.object({
  object: z.literal('list'),
  data: AwattarPrice.array(),
  url: z.string(),
})

const { cache } = useInMemoryCache<AwattarPricesResponse['data']>()

type AwattarPricesResponse = z.infer<typeof AwattarPricesResponse>

const fetchPricesFromAwattar = async (dateIso: string): Promise<AwattarPricesResponse['data']> => {
  const url = buildUrl(dateIso)
  const { data } = await axios.get(url)
  return AwattarPricesResponse.parse(data).data
}

const buildUrl = (dateIso: string) => {
  const targetDate = DateTime.fromISO(dateIso).startOf('day')
  const start = targetDate.toMillis()
  const end = targetDate.plus({ days: 1 }).toMillis()
  return `https://api.awattar.at/v1/marketdata?start=${start}&end=${end}`
}
