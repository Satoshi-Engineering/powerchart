import { DateTime } from 'luxon'

import availableGrids from '~/assets/grids'
import type { Fee } from '~/types/Fee'
import { type GridFees, CustomGridFees } from '~/types/GridFees'

/**
 * `selectedGrid` and `customGrid` are actually the "state", but we want the url to be updated whenever the state changes.
 * So we opted to use getters/setters instead of a state. Also we cannot use a WriteableComputedRef in the state, as we use nuxt
 * SSR, and therefore the state has to be serializable. We could return a WriteableComputedRef in the getter, but I think that would make
 * the code more obscure.
 */
export const useGridFees = defineStore('gridFees', {
  getters: {
    selectedGrid(): string {
      const config = useRuntimeConfig()
      const selectedGrid = useQueryParameterSetting('selectedGrid', config.public.defaultGrid)
      return selectedGrid.value
    },
    customGrid(): CustomGridFees {
      const customGrid = useQueryParameterSetting('customGrid', JSON.stringify(CustomGridFees.parse({})))
      try {
        return JSON.parse(customGrid.value)
      } catch {
        return CustomGridFees.parse({})
      }
    },
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
    setSelectedGrid(grid: string): void {
      const config = useRuntimeConfig()
      const selectedGrid = useQueryParameterSetting('selectedGrid', config.public.defaultGrid)
      selectedGrid.value = grid
    },
    setCustomGrid(grid: CustomGridFees): void {
      const customGrid = useQueryParameterSetting('customGrid', JSON.stringify(CustomGridFees.parse({})), 'push')
      customGrid.value = JSON.stringify(grid)
    },
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
