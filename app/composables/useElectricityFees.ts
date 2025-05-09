import type { DateTime } from 'luxon'

import fees from '../assets/fees.json'

/**
 * FeeValues.validUntil has to be a unix timestamp
 * FeeValues.amount[x].validUntil is the amount of seconds passed on the given day in localized time.
 */
type FeeValues = {
  validUntil: number | null
  amount: number | {
    validUntil: number
    value: number
  }[]
}

type Fee = {
  id: string
  label: string
  color: string
  values: FeeValues[]
}

const feeById: Record<string, Fee> = (fees as Fee[]).reduce((accumulator, fee) => ({
  ...accumulator,
  [fee.id]: fee,
}), {})

const feeForDate = (fee: string, date: DateTime): number => {
  if (feeById[fee] == null) {
    return 0
  }
  const usedValue = feeById[fee].values.find(({ validUntil }) => validUntil == null || validUntil > date.toUnixInteger())
  if (typeof usedValue?.amount === 'number') {
    return usedValue.amount
  }
  if (Array.isArray(usedValue?.amount)) {
    const secondsOfDay = date.hour * 3600 + date.minute * 60 + date.second
    const usedValueForDay = usedValue?.amount.find(({ validUntil }) => validUntil > secondsOfDay)
    if (usedValueForDay != null) {
      return usedValueForDay.value
    }
  }
  return 0
}

export default function useElectricityFees() {
  return { fees, feeById, feeForDate }
}
