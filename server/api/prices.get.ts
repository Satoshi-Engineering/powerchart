import { z } from 'zod'

import type { AwattarPrice } from '~~/shared/data/AwattarPrice'

import { loadAwattarPrices } from '~~/server/services/loadAwattarPrices'

export default defineEventHandlerWithErrorCodes(async (event): Promise<AwattarPrice[]> => {
  const { dateIso } = await getValidatedQuery(
    event,
    z.object({
      dateIso: z.string(),
    }).parse,
  )

  const data = await loadAwattarPrices(dateIso)
  return data
})
