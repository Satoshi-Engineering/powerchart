import { DateTime } from 'luxon'
import { ref, reactive } from 'vue'

import type { AwattarPrice } from '~~/shared/data/AwattarPrice'

export type CtPerKWh = number
export type EurPerMWh = number

export default function useElectricityPrices() {
  const loading = ref<string[]>([])
  const loadingFailed = ref<string[]>([])
  const marketpricesByDate = reactive<Record<string, AwattarPrice[]>>({})

  const loadForDateIso = async (dateIso: string) => {
    if (marketpricesByDate[dateIso] != null || loading.value.includes(dateIso)) {
      return
    }
    loading.value = [...loading.value, dateIso]
    loadingFailed.value = loadingFailed.value.filter((currentDateIso) => currentDateIso !== dateIso)
    const { data, error } = await useFetch(`/api/prices?dateIso=${dateIso}`)
    if (data.value != null) {
      marketpricesByDate[dateIso] = data.value
    } else {
      console.error(error.value ?? `Error loading data for ${dateIso}`)
      loadingFailed.value = [...loadingFailed.value, dateIso]
    }
    loading.value = loading.value.filter((currentDateIso) => currentDateIso !== dateIso)
  }

  const priceForDate = (date: DateTime, electricitySupplier = 'EnergieSteiermark'): CtPerKWh => {
    const dateIso = date.toISODate()
    if (dateIso == null || marketpricesByDate[dateIso] == null) {
      return 0
    }
    const usedPrice = marketpricesByDate[dateIso].find(
      ({ start_timestamp, end_timestamp }: { start_timestamp: number, end_timestamp: number }) => (
        date.toMillis() >= start_timestamp
        && date.toMillis() < end_timestamp
      ),
    )
    if (usedPrice == null) {
      return 0
    }
    return addSupplierFee(usedPrice.marketprice / 10, electricitySupplier)
  }

  const priceForTimestamp = (timestamp: number, electricitySupplier = 'EnergieSteiermark'): CtPerKWh => {
    const date = DateTime.fromMillis(timestamp)
    const dateIso = date.toISODate()
    if (dateIso == null || marketpricesByDate[dateIso] == null) {
      return 0
    }
    const usedPrice = marketpricesByDate[dateIso].find(
      ({ start_timestamp, end_timestamp }: { start_timestamp: number, end_timestamp: number }) => (
        timestamp >= start_timestamp
        && timestamp < end_timestamp
      ),
    )
    if (usedPrice == null) {
      return 0
    }
    return addSupplierFee(usedPrice.marketprice / 10, electricitySupplier)
  }

  const addSupplierFee = (price: CtPerKWh, electricitySupplier = 'EnergieSteiermark'): CtPerKWh => {
    // EPEX price is the base price
    if (electricitySupplier === 'EPEX') {
      return price
    }

    // awattar takes 3 % fee in either direction
    if (electricitySupplier === 'awattar') {
      return price + Math.abs(price * 0.03)
    }

    // awattar takes 3 % fee in either direction + 1,5 ct/kWh since 2024
    if (electricitySupplier === 'awattar-2024') {
      return price + Math.abs(price * 0.03) + 1.5
    }

    // Energie Steiermark adds 1,2 ct/kWh (i.e. 12 €/Mwh) on top of EPEX price
    return price + 1.2
  }

  return { loadForDateIso, loading, loadingFailed, priceForDate, priceForTimestamp }
}
