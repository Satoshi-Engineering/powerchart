import { DateTime } from 'luxon'
import { z } from 'zod/v4'

export const Fee = z.object({
  id: z.string(),
  label: z.string().describe('human-readable label for the fee'),
  color: z.string().refine(
    (val) => /^#[0-9A-F]{6}$/i.test(val),
    { message: 'Invalid hex color.' },
  ).describe('hex color code in format #RRGGBB'),
  values: z.object({
    validUntil: z
      .iso.date()
      .refine(
        (date) => DateTime.fromISO(date).year >= 2022,
        { error: 'No dates before 2022 allowed.' },
      )
      .nullable()
      .describe('date in ISO format (YYYY-MM-DD), until which the fee is valid. year must be 2022 or later'),
    amount: z.union([
      z.number().gte(0),
      z.array(z.object({
        validUntil: z
          .iso.time({ precision: -1 })
          .nullable()
          .describe('time of the day in ISO format (HH:mm), until which the fee is valid'),
        value: z.number().gte(0),
      })),
    ]),
  }).array(),
})

export type Fee = z.infer<typeof Fee>
