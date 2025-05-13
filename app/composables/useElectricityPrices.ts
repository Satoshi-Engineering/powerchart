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
    try {
      marketpricesByDate[dateIso] = await $fetch('/api/prices', { query: { dateIso } })
    } catch (error) {
      console.error(error)
      loadingFailed.value = [...loadingFailed.value, dateIso]
    } finally {
      loading.value = loading.value.filter((currentDateIso) => currentDateIso !== dateIso)
    }
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
    if (electricitySupplier === 'awattar' && price < 0) {
      return price * 0.97
    } else if (electricitySupplier === 'awattar') {
      return price * 1.03
    }

    // Energie Steiermark adds 1,2 ct/kWh (i.e. 12 €/Mwh) on top of EPEX price
    return price + 1.2
  }

  return { loadForDateIso, loading, loadingFailed, priceForDate, priceForTimestamp }
}
