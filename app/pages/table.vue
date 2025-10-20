<template>
  <UContainer
    class="max-w-xl"
    data-testid="page-table"
  >
    <div class="flex-1 flex flex-col items-center overflow-hidden">
      <div
        v-if="showLoadingAnimation"
        class="flex-1 grid justify-center content-center"
      >
        <AnimatedLoadingWheel />
      </div>
      <div
        v-else-if="showContent && selectedDateIso != null && loadingFailed.includes(selectedDateIso)"
        class="flex-1 grid justify-center content-center text-red-600"
      >
        {{ $t('errors.loadingPricesFailed') }}
      </div>
      <div
        v-else-if="showContent"
        class="
          w-full max-w-lg mx-auto
          min-h-[550px]
          py-1 pr-2
          grid grid-cols-[40px_1fr_1fr_1fr] gap-0.5 text-sm
        "
        :class="{
          'h-[calc(100dvh_-_var(--ui-header-height))]': !surroundingLayoutDisabled,
          'max-h-[calc(min(1000px,100svh)_-_var(--ui-header-height))]': !surroundingLayoutDisabled,
          'h-dvh': surroundingLayoutDisabled,
          'max-h-[min(1000px,100svh)]': surroundingLayoutDisabled,
        }"
        data-testid="electricity-prices-table"
      >
        <TableHeaderItem />
        <TableHeaderItem>
          {{ $d(selectedDate.minus({ days: 1 }).toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ $d(selectedDate.toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ $d(selectedDate.plus({ days: 1 }).toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <template
          v-for="(price, index) in prices"
          :key="index"
        >
          <div class="flex items-center justify-end pr-3 text-right">
            {{ String(price.hour).padStart(2, '0') }}
          </div>
          <TablePriceItem
            :loading="!priceForDateAvailable(selectedDate.minus({ days: 1 }))"
            :price="price.pricePrev"
            :is-current-hour="
              selectedDate.minus({ days: 1 }).toISODate() === today
                && String(price.hour) === currentHour
            "
            :price-range="getRange(price.pricePrev)"
            data-testid="price-item"
            data-test-day="prev"
            :data-test-hour="price.hour"
          />
          <TablePriceItem
            :loading="!priceForDateAvailable(selectedDate)"
            :price="price.price"
            :is-current-hour="
              selectedDate.toISODate() === today
                && String(price.hour) === currentHour
            "
            :price-range="getRange(price.price)"
            data-testid="price-item"
            data-test-day="current"
            :data-test-hour="price.hour"
          />
          <TablePriceItem
            v-if="selectedDate.plus({ days: 1 }) <= maxDate"
            :loading="!priceForDateAvailable(selectedDate.plus({ days: 1 }))"
            :price="price.priceNext"
            :is-current-hour="
              selectedDate.plus({ days: 1 }).toISODate() === today
                && String(price.hour) === currentHour
            "
            :price-range="getRange(price.priceNext)"
            data-testid="price-item"
            data-test-day="next"
            :data-test-hour="price.hour"
          />
          <div v-else />
        </template>
      </div>
      <div class="relative w-full flex my-4 px-2 justify-center">
        <DatePicker
          v-model="selectedDate"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="selectedDateIso != null && loadingPrices.includes(selectedDateIso)"
          :size="size"
        />
      </div>
      <div
        v-if="$i18n.locale === 'de'"
        class="mt-5"
      >
        <TypoHeadline level="h2">
          🟡 So funktionieren die Farben in der Preistabelle
        </TypoHeadline>
        <TypoParagraph>
          Die Farben in der Preistabelle helfen dir, auf einen Blick zu erkennen, wie günstig oder teuer der Strompreis gerade ist.
        </TypoParagraph>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>
            <strong>Grün</strong> steht für sehr niedrige Preise – ein guter Zeitpunkt, um Strom zu verbrauchen.
          </li>
          <li>
            <strong>Gelb oder Orange</strong> zeigen durchschnittliche bis leicht erhöhte Preise – nichts Ungewöhnliches.
          </li>
          <li>
            <strong>Rot</strong> bedeutet sehr hohe Preise – besser Strom sparen.
          </li>
          <li>
            <strong>Grau</strong> erscheint, solange die Preise noch geladen werden.
          </li>
        </ul>
        <TypoParagraph>
          Die <strong>aktuelle Stunde</strong> ist immer mit einem schwarzen Rahmen hervorgehoben, damit du sie leicht findest.
        </TypoParagraph>
        <TypoHeadline level="h3">
          🔄 Dynamische Farbanpassung
        </TypoHeadline>
        <TypoParagraph>
          Die Farbskala passt sich automatisch an die Preisspanne der drei sichtbaren Tage an. So kannst du schnell erkennen, welche Stunden im Vergleich besonders günstig oder teuer sind.
        </TypoParagraph>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>
            Liegt ein Preis <strong>unter {{ lowAlert.toFixed(2) }}</strong>, wird er immer in <strong>dunkelgrün</strong> dargestellt – für besonders niedrige Kosten.
          </li>
          <li>
            Liegt ein Preis <strong>über {{ highAlert.toFixed(2) }}</strong>, wird er immer in <strong>dunkelrot</strong> angezeigt – als Warnung vor besonders hohen Preisen.
          </li>
        </ul>
        <TypoParagraph>
          Diese festen Farbpunkte sorgen dafür, dass Extrempreise jederzeit deutlich erkennbar sind – unabhängig von der allgemeinen Preisspanne.
        </TypoParagraph>
      </div>
      <div
        v-else
        class="mt-5"
      >
        <TypoHeadline
          level="h2"
        >
          🟡 How the Colors Work in the Pricing Table
        </TypoHeadline>
        <TypoParagraph>
          The colors in the pricing table help you quickly understand how favorable electricity prices are.
        </TypoParagraph>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>
            <strong>Green</strong> indicates very low prices — a great time to use electricity.
          </li>
          <li>
            <strong>Yellow or orange</strong> signals average to slightly high prices — nothing too unusual.
          </li>
          <li>
            <strong>Red</strong> shows very high prices — it’s best to reduce consumption.
          </li>
          <li>
            <strong>Gray</strong> appears while prices are still loading.
          </li>
        </ul>
        <TypoParagraph>
          The <strong>current hour</strong> is always outlined with a black border for easy reference.
        </TypoParagraph>
        <TypoHeadline
          level="h3"
        >
          🔄 Dynamic Color Scaling
        </TypoHeadline>
        <TypoParagraph>
          Color scaling adapts automatically to the range of prices shown across the three visible days. This makes it easy to see which hours are relatively cheap or expensive compared to the rest of the current period.
        </TypoParagraph>
        <ul class="list-disc list-inside space-y-1 mb-4">
          <li>
            If a price is <strong>below {{ lowAlert.toFixed(2) }}</strong>, it’s always shown in <strong>dark green</strong> to highlight extremely low costs.
          </li>
          <li>
            If a price is <strong>above {{ highAlert.toFixed(2) }}</strong>, it’s always shown in <strong>dark red</strong> to signal a particularly high price.
          </li>
        </ul>
        <TypoParagraph>
          These fixed endpoints ensure that extreme prices stand out clearly, regardless of the overall price range.
        </TypoParagraph>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { computed, watchEffect, ref, onBeforeMount, onBeforeUnmount } from 'vue'

import type { PriceRange } from '~/components/table/TablePriceItem.vue'
import useCurrentTime from '~/composables/useCurrentTime'

const { size } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDateAvailable,
  priceForDate,
} = useElectricityPrices()

const { surroundingLayoutDisabled } = useDisableSurroundingLayout()

const minDate = ref(DateTime.fromISO('2023-01-01').startOf('day'))
const maxDate = computed(() => {
  const dateTomorrow = DateTime.now().endOf('day').plus({ days: 1 })
  if (priceForDate(dateTomorrow) === 0) {
    return DateTime.now().endOf('day')
  }
  return dateTomorrow
})

const {
  selectedDate, selectedDateIso,
} = useDate()

watchEffect(() => {
  if (selectedDateIso.value == null) {
    return
  }
  loading.value = loadingPrices.includes(selectedDateIso.value)
})
watchEffect(() => {
  if (selectedDateIso.value == null) {
    return
  }
  loadForDateIso(selectedDateIso.value)
  const dateIsoPrev = selectedDate.value.minus({ days: 1 }).toISODate()
  if (dateIsoPrev != null) {
    loadForDateIso(dateIsoPrev)
  }
  const dateIsoPrevPrev = selectedDate.value.minus({ days: 2 }).toISODate()
  if (dateIsoPrevPrev != null) {
    loadForDateIso(dateIsoPrevPrev)
  }
  const dateIsoNext = selectedDate.value.plus({ days: 1 }).toISODate()
  if (dateIsoNext != null) {
    loadForDateIso(dateIsoNext)
  }
  const dateIsoNextNext = selectedDate.value.plus({ days: 2 }).toISODate()
  if (dateIsoNextNext != null) {
    loadForDateIso(dateIsoNextNext)
  }
})

/////
// prices
const { getPriceForCurrentElectricityTariff } = useElectricityProviders()
const { addVat } = useAddVat()
const { getAllFeesForDateTime } = useGridFees()
const prices = computed<{
  hour: number
  pricePrev: number
  price: number
  priceNext: number
}[]>(() => {
  const prices = []
  for (let hour = 0; hour < 24; hour++) {
    prices.push({
      hour,
      pricePrev: getPriceForDateTime(selectedDate.value.minus({ days: 1 }).set({ hour })),
      price: getPriceForDateTime(selectedDate.value.set({ hour })),
      priceNext: getPriceForDateTime(selectedDate.value.plus({ days: 1 }).set({ hour })),
    })
  }
  return prices
})

const getPriceForDateTime = (dateTime: DateTime): number => {
  const price = priceForDate(dateTime) + getAllFeesForDateTime(dateTime)
  if (addVat.value) {
    return price * 1.2
  }
  return price
}

const allCurrentlyDisplayedPrices = computed(() => {
  if (selectedDate.value.toISODate() === maxDate.value.toISODate()) {
    return prices.value.flatMap((p) => [
      p.pricePrev,
      p.price,
    ])
  }
  return prices.value.flatMap((p) => [
    p.pricePrev,
    p.price,
    p.priceNext,
  ])
})

const getRange = (price: number): PriceRange => {
  if (price <= ranges.value.lowAlert) {
    return 'lowAlert'
  }
  if (price > ranges.value.highest) {
    return 'highAlert'
  }
  if (price <= ranges.value.lowest) {
    return 'lowest'
  }
  if (price <= ranges.value.lower) {
    return 'lower'
  }
  if (price <= ranges.value.low) {
    return 'low'
  }
  if (price <= ranges.value.mid) {
    return 'mid'
  }
  if (price <= ranges.value.high) {
    return 'high'
  }
  if (price <= ranges.value.highest) {
    return 'highest'
  }
  return 'highAlert'
}

const midday = DateTime.fromISO('12:00')
const lowAlert = computed(() => {
  const netto = Math.min(getPriceForCurrentElectricityTariff(-10) + getAllFeesForDateTime(midday), 0)
  if (addVat.value) {
    return netto * 1.2
  }
  return netto
})

const highAlert = computed(() => {
  const netto = getPriceForCurrentElectricityTariff(30) + getAllFeesForDateTime(midday)
  if (addVat.value) {
    return netto * 1.2
  }
  return netto
})

const ranges = computed(() => ({
  lowAlert: lowAlert.value,
  lowest: minPrice.value + Math.min(priceDelta.value * 0.10, 10),
  lower: minPrice.value + Math.min(priceDelta.value * 0.25, 10),
  low: minPrice.value + priceDelta.value * 0.5,
  mid: maxPrice.value - Math.min(priceDelta.value * 0.25, 10),
  high: maxPrice.value - Math.min(priceDelta.value * 0.10, 10),
  highest: highAlert.value,
}))

const minPrice = computed(() => {
  const allPrices = allCurrentlyDisplayedPrices.value
  if (allPrices.length === 0) {
    return 0
  }
  return Math.min(...allPrices)
})

const maxPrice = computed(() => {
  const allPrices = allCurrentlyDisplayedPrices.value
  if (allPrices.length === 0) {
    return 0
  }
  return Math.max(...allPrices)
})

const priceDelta = computed(() => maxPrice.value - minPrice.value)

/////
// reload data after one hour
const { today, currentHour } = useCurrentTime()

const reconnectOnVisibilityChange = () => {
  if (
    document.visibilityState !== 'visible'
    || DateTime.now().toFormat('H') === currentHour.value
  ) {
    return
  }
  location.reload()
}

onBeforeMount(() => {
  document.addEventListener('visibilitychange', reconnectOnVisibilityChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', reconnectOnVisibilityChange)
})
</script>
