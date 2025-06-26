import { z } from 'zod/v4'

import { Fee } from './Fee'

export const GridFees = z.object({
  id: z.string(),
  label: z.union([
    z.object({
      de: z.string(),
      en: z.string(),
    }),
    z.string(),
  ]),
  fees: Fee.array(),
})

export type GridFees = z.infer<typeof GridFees>

export const CustomGridFees = z.object({
  id: z.literal('custom').default('custom'),
  label: z.string().default(''),
  fees: Fee.array().default([]),
})

export type CustomGridFees = z.infer<typeof CustomGridFees>
