import { DateTime } from 'luxon'

import availableGrids from '~/assets/grids'
import type { Fee } from '~/types/Fee'
import { type GridFees, CustomGridFees } from '~/types/GridFees'

export const useGridFees = defineStore('gridFees', {
  state: (): {
    selectedGrid: string
    customGrid: CustomGridFees
  } => {
    const config = useRuntimeConfig()
    const route = useRoute()

    let selectedGrid = config.public.defaultGrid
    if (route.query.selectedGrid) {
      selectedGrid = String(route.query.selectedGrid)
    }

    let customGrid: CustomGridFees
    try {
      customGrid = CustomGridFees.parse(JSON.parse(route.query.customGrid as string))
    } catch {
      customGrid = CustomGridFees.parse({})
    }

    return {
      selectedGrid,
      customGrid,
    }
  },
  getters: {
    availableGrids(): GridFees[] {
      const config = useRuntimeConfig()
      return availableGrids.filter((grid) => config.public.availableGrids.includes(grid.id))
    },
    availableGridsById(): Record<GridFees['id'], GridFees> {
      return Object.fromEntries(this.availableGrids.map((grid) => [grid.id, grid]))
    },
    fees(): Fee[] {
      if (this.selectedGrid === 'custom') {
        return this.customGrid.fees
      }
      const selectedGrid = this.availableGridsById[this.selectedGrid]
      if (selectedGrid == null) {
        return []
      }
      return selectedGrid.fees
    },
    feeById(): Record<Fee['id'], Fee> {
      return Object.fromEntries(this.fees.map((fee) => [fee.id, fee]))
    },
  },
  actions: {
    getAllFeesForDateTime(date: DateTime): number {
      return this.fees.reduce((total, fee) => {
        const feeValue = this.getFeeForDateTime(fee.id, date)
        return total + feeValue
      }, 0)
    },
    getFeeForDateTime(feeId: string, date: DateTime): number {
      const fee = this.feeById[feeId]
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
    },
    getColorForFeeId(feeId: Fee['id']): Fee['color'] {
      const fee = this.feeById[feeId]
      if (fee == null) {
        throw new Error(`Fee with id ${feeId} not found`)
      }
      return fee.color
    },
  },
})
