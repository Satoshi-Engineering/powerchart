import { z } from 'zod'

export const Fee = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string().refine(
    (val) => /^#[0-9A-F]{6}$/i.test(val),
    { message: 'Invalid hex color' },
  ),
  values: z.object({
    validUntil: z.number().int().gte(
      1640995200,
      { message: 'No dates before 2022 allowed.' },
    ).nullable(),
    amount: z.union([
      z.number().gte(0),
      z.array(z.object({
        validUntil: z.number().int().gte(0).lte(86400).describe('describes the time of the day in secods from midnight'),
        value: z.number().gte(0),
      })),
    ]),
  }).array(),
})

export type Fee = z.infer<typeof Fee>

export const fees: Fee[] = [{
  id: 'infrastructureFee',
  label: 'Infrastrukturbeitrag',
  color: '#9BE2B0',
  values: [{
    validUntil: null,
    amount: 4,
  }],
}, {
  id: 'gridFee',
  label: 'Netznutzungsentgelt',
  color: '#8AA1B1',
  values: [{
    validUntil: 1704063600,
    amount: [{
      validUntil: 21600,
      value: 3.44,
    }, {
      validUntil: 79200,
      value: 6.89,
    }, {
      validUntil: 86400,
      value: 3.44,
    }],
  }, {
    validUntil: 1735686000,
    amount: [{
      validUntil: 21600,
      value: 3.73,
    }, {
      validUntil: 79200,
      value: 7.47,
    }, {
      validUntil: 86400,
      value: 3.73,
    }],
  }, {
    validUntil: null,
    amount: [{
      validUntil: 21600,
      value: 6.85,
    }, {
      validUntil: 79200,
      value: 9.25,
    }, {
      validUntil: 86400,
      value: 6.85,
    }],
  }],
}, {
  id: 'gridLoss',
  label: 'Netzverlustentgelt',
  color: '#9AC2C9',
  values: [{
    validUntil: 1677625200,
    amount: 2.328,
  }, {
    validUntil: 1704063600,
    amount: 0.387,
  }, {
    validUntil: 1735686000,
    amount: 0.793,
  }, {
    validUntil: null,
    amount: 0.444,
  }],
}, {
  id: 'renewableFee',
  label: 'Erneuerbare Förderbeitrag',
  color: '#CAA0D0',
  values: [{
    validUntil: 1735686000,
    amount: 0.0,
  }, {
    validUntil: null,
    amount: 0.796,
  }],
}, {
  id: 'electricityFee',
  label: 'Elektrizitätsabgabe',
  color: '#D0A0A0',
  values: [{
    validUntil: 1735686000,
    amount: 0.1,
  }, {
    validUntil: null,
    amount: 1.5,
  }],
}]
