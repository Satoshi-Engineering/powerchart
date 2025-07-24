import { evaluate } from 'mathjs'

import { electricityTariffs } from '@/assets/electricityTariffs'
import {
  type ElectricityTariff,
  CustomTariff,
} from '@/types/ElectricityTariff'

export default () => {
  const config = useRuntimeConfig()

  const selectedTariff = useQueryParameterSetting('selectedTariff', config.public.defaultElectricityTariff)

  const customTariffQueryParameter = useQueryParameterSetting('customTariff', JSON.stringify(CustomTariff.parse({})))
  const customTariff = computed({
    get() {
      try {
        return CustomTariff.parse(JSON.parse(customTariffQueryParameter.value))
      } catch {
        return CustomTariff.parse({})
      }
    },
    set(tariff: CustomTariff) {
      customTariffQueryParameter.value = JSON.stringify(tariff)
    },
  })

  const availableTariffs = ref(electricityTariffs)

  const priceForFormula = computed(() => {
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
  })

  const currentElectricityTariff = computed((): ElectricityTariff | null => {
    if (selectedTariff.value === customTariff.value.id) {
      return customTariff.value
    }
    const provider = availableTariffs.value.find((provider: ElectricityTariff) => provider.id === selectedTariff.value)
    if (provider == null) {
      console.warn(`No provider found for id: ${selectedTariff.value}`)
      return null
    }
    return provider
  })

  const currentFormula = computed((): ElectricityTariff['formula'] => {
    return currentElectricityTariff.value?.formula ?? ''
  })

  const getPriceForCurrentElectricityTariff = (price: number): number => {
    const calculatedPrice = priceForFormula.value(price, currentFormula.value)
    if (isNaN(calculatedPrice)) {
      return price
    }
    return calculatedPrice
  }

  return {
    selectedTariff,
    customTariff,
    availableTariffs,
    priceForFormula,
    currentElectricityTariff,
    currentFormula,
    getPriceForCurrentElectricityTariff,
  }
}
