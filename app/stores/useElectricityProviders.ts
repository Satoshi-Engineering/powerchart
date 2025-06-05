import {
  type ElectricityProvider,
  epexSpotAt,
  awattarHourlyPre2024,
  awattarHourly,
  energieSteiermarkSpot,
  smartEnergyControl,
} from '@/assets/electricityProviders'

export const useElectricityProviders = defineStore('electricityProviders', {
  state: () => ({
    slectedElectricityProvider: 'epex-spot-at',
    customElectricityProviderName: '',
    customElectricityProviderTariff: '',
    customProviderFormula: (price: number) => price,
  }),
  getters: {
    availableTariffs(state): ElectricityProvider[] {
      return [
        epexSpotAt,
        awattarHourlyPre2024,
        awattarHourly,
        energieSteiermarkSpot,
        smartEnergyControl,
        {
          id: 'custom',
          name: state.customElectricityProviderName,
          tariff: state.customElectricityProviderTariff,
          formula: (price: number) => state.customProviderFormula(price),
        },
      ]
    },
    currentElectricityProvider(state): ElectricityProvider {
      const provider = this.availableTariffs
        .find((provider: ElectricityProvider) => provider.id === state.slectedElectricityProvider)
      if (provider == null) {
        throw new Error(`No provider found for id: ${this.slectedElectricityProvider}`)
      }
      return provider
    },
  },
  actions: {
    setSelectedProvider(providerId: string) {
      this.slectedElectricityProvider = providerId
    },
    setCustomElectricityProviderName(name: string) {
      this.customElectricityProviderName = name
    },
    setCustomElectricityProviderTariff(tariff: string) {
      this.customElectricityProviderTariff = tariff
    },
    setCustomProviderFormula(formula: (price: number) => number) {
      this.customProviderFormula = formula
    },
    getPriceForCurrentElectricityProvider(price: number): number {
      return this.currentElectricityProvider.formula(price)
    },
  },
})
