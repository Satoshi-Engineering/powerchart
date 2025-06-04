import { DateTime } from 'luxon'

import type { AwattarPrice } from '~~/shared/data/AwattarPrice'

export type CtPerKWh = number
export type EurPerMWh = number

export const useElectricityPrices = defineStore('electricityPrices', {
  state: () => ({
    loading: [] as string[],
    loadingFailed: [] as string[],
    marketpricesByDate: {} as Record<string, AwattarPrice[]>,
  }),
  getters: {
    priceForDateAvailable: (state) => (date: DateTime): boolean => {
      const dateIso = date.toISODate()
      if (dateIso == null) {
        return false
      }
      return state.marketpricesByDate[dateIso] != null
        && state.marketpricesByDate[dateIso].length > 0
        && !state.loadingFailed.includes(dateIso)
    },
  },
  actions: {
    async loadForDateIso(dateIso: string) {
      if (this.marketpricesByDate[dateIso] != null || this.loading.includes(dateIso)) {
        return
      }
      this.loading = [...this.loading, dateIso]
      this.loadingFailed = this.loadingFailed.filter((currentDateIso) => currentDateIso !== dateIso)
      const { data, error } = await useFetch(`/api/prices?dateIso=${dateIso}`)
      if (data.value != null) {
        this.marketpricesByDate[dateIso] = data.value
      } else {
        console.error(error.value ?? `Error loading data for ${dateIso}`)
        this.loadingFailed = [...this.loadingFailed, dateIso]
      }
      this.loading = this.loading.filter((currentDateIso) => currentDateIso !== dateIso)
    },
    priceForDate(date: DateTime, electricitySupplier = 'EnergieSteiermark'): CtPerKWh {
      const dateIso = date.toISODate()
      if (dateIso == null || this.marketpricesByDate[dateIso] == null) {
        return 0
      }
      const usedPrice = this.marketpricesByDate[dateIso].find(
        ({ start_timestamp, end_timestamp }: { start_timestamp: number, end_timestamp: number }) => (
          date.toMillis() >= start_timestamp
          && date.toMillis() < end_timestamp
        ),
      )
      if (usedPrice == null) {
        return 0
      }
      return this.addSupplierFee(usedPrice.marketprice / 10, electricitySupplier)
    },
    priceForTimestamp(timestamp: number, electricitySupplier = 'EnergieSteiermark'): CtPerKWh {
      const date = DateTime.fromMillis(timestamp)
      const dateIso = date.toISODate()
      if (dateIso == null || this.marketpricesByDate[dateIso] == null) {
        return 0
      }
      const usedPrice = this.marketpricesByDate[dateIso].find(
        ({ start_timestamp, end_timestamp }: { start_timestamp: number, end_timestamp: number }) => (
          timestamp >= start_timestamp
          && timestamp < end_timestamp
        ),
      )
      if (usedPrice == null) {
        return 0
      }
      return this.addSupplierFee(usedPrice.marketprice / 10, electricitySupplier)
    },
    addSupplierFee(price: CtPerKWh, electricitySupplier = 'EnergieSteiermark'): CtPerKWh {
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
    },
  },
})
