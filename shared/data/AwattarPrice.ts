import { z } from 'zod'

export const AwattarPrice = z.object({
  start_timestamp: z.number().int(),
  end_timestamp: z.number().int(),
  marketprice: z.number(),
  unit: z.literal('Eur/MWh'),
})

export type AwattarPrice = z.infer<typeof AwattarPrice>
