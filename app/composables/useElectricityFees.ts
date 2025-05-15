import type { DateTime } from 'luxon'

import { fees } from '~~/app/assets/fees'

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

const colorForFeeId = (feeId: Fee['id']): Fee['color'] => {
  if (feeById[feeId] == null) {
    throw new Error(`Fee with id ${feeId} not found`)
  }
  return feeById[feeId].color
}

export default function useElectricityFees() {
  return { fees, feeById, feeForDate, colorForFeeId }
}
