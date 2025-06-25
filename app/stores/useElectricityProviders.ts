import { evaluate } from 'mathjs'

import { electricityTariffs } from '@/assets/electricityTariffs'
import {
  type ElectricityTariff,
  CustomTariff,
} from '@/types/ElectricityTariff'

export const useElectricityProviders = defineStore('electricityProviders', {
  state: (): {
    selectedTariff: string
    customTariff: ElectricityTariff
  } => {
    const config = useRuntimeConfig()
    const route = useRoute()

    let selectedTariff = config.public.defaultElectricityTariff
    if (route.query.selectedTariff) {
      selectedTariff = String(route.query.selectedTariff)
    }

    let customTariff: CustomTariff
    try {
      customTariff = CustomTariff.parse(JSON.parse(route.query.customTariff as string))
    } catch {
      customTariff = CustomTariff.parse({})
    }

    return {
      selectedTariff,
      customTariff,
    }
  },
  getters: {
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
    currentElectricityTariff(state): ElectricityTariff | null {
      if (state.selectedTariff === state.customTariff.id) {
        return state.customTariff
      }
      const provider = this.availableTariffs
        .find((provider: ElectricityTariff) => provider.id === state.selectedTariff)
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
    getPriceForCurrentElectricityTariff(price: number): number {
      const calculatedPrice = this.priceForFormula(price, this.currentFormula)
      if (isNaN(calculatedPrice)) {
        return price
      }
      return calculatedPrice
    },
  },
})
