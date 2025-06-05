import {
  type ElectricityTariff,
  epexSpotAt,
  awattarHourlyPre2024,
  awattarHourly,
  energieSteiermarkSpot,
  smartEnergyControl,
} from '@/assets/electricityTariffs'

// todo : make the custom provider editable in the UI
// todo : store custom provider settings in the url

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
      // customFormula: (price: number) => price, has to be a string as nuxt hydration cannot handle functions
    }
  },
  getters: {
    availableTariffs(): ElectricityTariff[] {
      return [
        epexSpotAt,
        energieSteiermarkSpot,
        smartEnergyControl,
        awattarHourly,
        awattarHourlyPre2024,
      ]
    },
    currentElectricityTariff(state): ElectricityTariff | null {
      if (state.selectedTariff === 'custom') {
        return {
          id: 'custom',
          name: state.customName,
          provider: state.customProvider,
          formula: (price: number) => price,
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
