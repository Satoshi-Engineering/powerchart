import { evaluate } from 'mathjs'
import {
  type ElectricityTariff,
  epexSpotAt,
  awattarHourly,
  energieSteiermarkSpot,
  smartEnergyControl,
} from '@/assets/electricityTariffs'

// todo : store custom tariff settings in the url

export const useElectricityProviders = defineStore('electricityProviders', {
  state: () => {
    const config = useRuntimeConfig()
    let selectedTariff = config.public.defaultElectricityTariff
    const route = useRoute()
    if (route.query.selectedTariff) {
      selectedTariff = String(route.query.selectedTariff)
    }
    return {
      selectedTariff,
      customName: '',
      customProvider: '',
      customFormula: '',
    }
  },
  getters: {
    availableTariffs(): ElectricityTariff[] {
      return [
        epexSpotAt,
        energieSteiermarkSpot,
        smartEnergyControl,
        awattarHourly,
      ]
    },
    priceForCustomFormula() {
      return (price: number) => {
        try {
          const calculated = evaluate(`price = ${price}; ${this.customFormula}`)
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
      if (state.selectedTariff === 'custom') {
        return {
          id: 'custom',
          name: state.customName,
          provider: state.customProvider,
          formula: (price: number) => this.priceForCustomFormula(price),
        }
      }
      const provider = this.availableTariffs
        .find((provider: ElectricityTariff) => provider.id === state.selectedTariff)
      if (provider == null) {
        console.warn(`No provider found for id: ${this.selectedTariff}`)
        return null
      }
      return provider
    },
  },
  actions: {
    setSelectedTariff(tariffId: string) {
      this.selectedTariff = tariffId
    },
    setCustomName(name: string) {
      this.customName = name
    },
    setCustomProvider(provider: string) {
      this.customProvider = provider
    },
    getPriceForCurrentElectricityTariff(price: number): number {
      return this.currentElectricityTariff?.formula(price) || price
    },
  },
})
