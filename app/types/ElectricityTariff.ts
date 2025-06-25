import { z } from 'zod'

export type ElectricityTariff = {
  id: string
  name: string
  provider: string
  formula: string
}

export const CustomTariff = z.object({
  id: z.literal('custom').default('custom'),
  name: z.string().default(''),
  provider: z.string().default(''),
  formula: z.string().default(''),
})

export type CustomTariff = z.infer<typeof CustomTariff>
