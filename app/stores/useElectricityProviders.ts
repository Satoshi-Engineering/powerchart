import { evaluate } from 'mathjs'

import { electricityTariffs } from '@/assets/electricityTariffs'
import {
  type ElectricityTariff,
  CustomTariff,
} from '@/types/ElectricityTariff'

/**
 * `selectedTariff` and `customTariff` are actually the "state", but we want the url to be updated whenever the state changes.
 * So we opted to use getters/setters instead of a state. Also we cannot use a WriteableComputedRef in the state, as we use nuxt
 * SSR, and therefore the state has to be serializable. We could return a WriteableComputedRef in the getter, but I think that would make
 * the code more obscure.
 */
export const useElectricityProviders = defineStore('electricityProviders', {
  getters: {
    selectedTariff(): string {
      const config = useRuntimeConfig()
      const selectedTariff = useQueryParameterSetting('selectedTariff', config.public.defaultElectricityTariff)
      return selectedTariff.value
    },
    customTariff(): ElectricityTariff {
      const customTariff = useQueryParameterSetting('customTariff', JSON.stringify(CustomTariff.parse({})))
      try {
        return JSON.parse(customTariff.value)
      } catch {
        return CustomTariff.parse({})
      }
    },
    availableTariffs(): ElectricityTariff[] {
      return electricityTariffs
    },
    priceForFormula() {
      return (price: number, formula: string) => {
        try {
          const calculated = evaluate(`price = ${price}; ${formula}`)
          if (typeof calculated.entries[0] !== 'number') {
            return NaN
          }
          return calculated.entries[0]
        } catch {
          return NaN
        }
      }
    },
    currentElectricityTariff(): ElectricityTariff | null {
      if (this.selectedTariff === this.customTariff.id) {
        return this.customTariff
      }
      const provider = this.availableTariffs
        .find((provider: ElectricityTariff) => provider.id === this.selectedTariff)
      if (provider == null) {
        console.warn(`No provider found for id: ${this.selectedTariff}`)
        return null
      }
      return provider
    },
    currentFormula(): ElectricityTariff['formula'] {
      return this.currentElectricityTariff?.formula ?? ''
    },
  },
  actions: {
    setSelectedTariff(tariff: string): void {
      const config = useRuntimeConfig()
      const selectedTariff = useQueryParameterSetting('selectedTariff', config.public.defaultElectricityTariff)
      selectedTariff.value = tariff
    },
    setCustomTariff(tariff: ElectricityTariff): void {
      const customTariff = useQueryParameterSetting('customTariff', JSON.stringify(CustomTariff.parse({})))
      customTariff.value = JSON.stringify(tariff)
    },
    getPriceForCurrentElectricityTariff(price: number): number {
      const calculatedPrice = this.priceForFormula(price, this.currentFormula)
      if (isNaN(calculatedPrice)) {
        return price
      }
      return calculatedPrice
    },
  },
})
