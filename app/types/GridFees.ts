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
