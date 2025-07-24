import { DateTime } from 'luxon'

import allGrids from '~/assets/grids'
import type { Fee } from '~/types/Fee'
import { type GridFees, CustomGridFees } from '~/types/GridFees'

export default () => {
  const config = useRuntimeConfig()

  const selectedGrid = useQueryParameterSetting('selectedGrid', config.public.defaultGrid)

  const customGridQueryParameter = useQueryParameterSetting('customGrid', JSON.stringify(CustomGridFees.parse({})))
  const customGrid = computed({
    get() {
      try {
        return JSON.parse(customGridQueryParameter.value)
      } catch {
        return CustomGridFees.parse({})
      }
    },
    set(grid: CustomGridFees) {
      customGridQueryParameter.value = JSON.stringify(grid)
    },
  })

  const availableGrids = computed((): GridFees[] => allGrids.filter((grid) => config.public.availableGrids.includes(grid.id)))

  const availableGridsById = computed((): Record<GridFees['id'], GridFees> => {
    return Object.fromEntries(availableGrids.value.map((grid) => [grid.id, grid]))
  })

  const fees = computed((): Fee[] => {
    if (selectedGrid.value === 'custom') {
      return customGrid.value.fees
    }
    const grid = availableGridsById.value[selectedGrid.value]
    if (grid == null) {
      return []
    }
    return grid.fees
  })

  const feesById = computed((): Record<Fee['id'], Fee> => Object.fromEntries(fees.value.map((fee) => [fee.id, fee])))

  const getAllFeesForDateTime = (date: DateTime): number => {
    return fees.value.reduce((total, fee) => {
      const feeValue = getFeeForDateTime(fee.id, date)
      return total + feeValue
    }, 0)
  }

  const getFeeForDateTime = (feeId: string, date: DateTime): number => {
    const fee = feesById.value[feeId]
    if (fee == null) {
      return 0
    }
    const usedValue = fee.values.find(({ validUntil }) => validUntil == null || DateTime.fromISO(validUntil) > date)
    if (usedValue == null) {
      return 0
    }
    if (typeof usedValue.amount === 'number') {
      return usedValue.amount
    }
    const usedValueForDay = usedValue.amount.find(({ validUntil }) => {
      if (validUntil == null) {
        return true
      }
      return DateTime.fromISO(validUntil).hour > date.hour
    })
    if (usedValueForDay == null) {
      return 0
    }
    return usedValueForDay.value
  }

  const getColorForFeeId = (feeId: Fee['id']): Fee['color'] => {
    const fee = feesById.value[feeId]
    if (fee == null) {
      throw new Error(`Fee with id ${feeId} not found`)
    }
    return fee.color
  }

  return {
    selectedGrid,
    customGrid,
    availableGrids,
    availableGridsById,
    fees,
    feesById,
    getAllFeesForDateTime,
    getFeeForDateTime,
    getColorForFeeId,
  }
}
