<template>
  <UContainer class="max-w-xl">
    <div class="flex-1 flex flex-col items-center overflow-hidden">
      <div
        v-if="showLoadingAnimation"
        class="flex-1 grid justify-center content-center"
      >
        <AnimatedLoadingWheel />
      </div>
      <div
        v-else-if="showContent && currentDateIso != null && loadingFailed.includes(currentDateIso)"
        class="flex-1 grid justify-center content-center text-red-600"
      >
        {{ $t('errors.loadingPricesFailed') }}
      </div>
      <div
        v-else-if="showContent"
        class="
          w-full max-w-lg mx-auto
          min-h-[550px] max-h-[1000px]
          py-1 pr-2
          grid grid-cols-[40px_1fr_1fr_1fr] gap-0.5 text-sm
        "
        :class="{
          'h-[calc(100dvh_-_var(--ui-header-height))]': !surroundingLayoutDisabled,
          'h-dvh': surroundingLayoutDisabled,
        }"
        data-testid="electricity-prices-table"
      >
        <TableHeaderItem />
        <TableHeaderItem>
          {{ $d(currentDate.minus({ days: 1 }).toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ $d(currentDate.toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ $d(currentDate.plus({ days: 1 }).toJSDate(), 'monthAndDay') }}
        </TableHeaderItem>
        <template
          v-for="(price, index) in prices"
          :key="index"
        >
          <div class="flex items-center justify-end pr-3 text-right">
            {{ String(price.hour).padStart(2, '0') }}
          </div>
          <TablePriceItem
            :price="addFixedCostsAndVat(price.pricePrev)"
            :is-current-hour="
              currentDate.minus({ days: 1 }).toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            data-testid="price-item"
            data-test-day="prev"
            :data-test-hour="price.hour"
            :price-range="getRange(price.pricePrev)"
          />
          <TablePriceItem
            :price="addFixedCostsAndVat(price.price)"
            :is-current-hour="
              currentDate.toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            data-testid="price-item"
            data-test-day="current"
            :data-test-hour="price.hour"
            :price-range="getRange(price.price)"
          />
          <TablePriceItem
            v-if="currentDate.plus({ days: 1 }) <= maxDate"
            :price="addFixedCostsAndVat(price.priceNext)"
            :is-current-hour="
              currentDate.plus({ days: 1 }).toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            data-testid="price-item"
            data-test-day="next"
            :data-test-hour="price.hour"
            :price-range="getRange(price.priceNext)"
          />
          <div v-else />
        </template>
      </div>
      <div class="relative w-full flex my-4 px-2 justify-center">
        <DatePicker
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="currentDateIso != null && loadingPrices.includes(currentDateIso)"
          :size="size"
        />
      </div>
      <div class="w-full flex flex-col justify-start px-2">
        <label class="my-3 block">
          <input
            type="checkbox"
            :checked="addVat"
            data-testid="checkbox-add-vat"
            @change="addVat = !addVat"
          >
          {{ $t('pages.table.addVat') }}
        </label>
        <label class="my-3 flex flex-col">
          {{ $t('pages.table.fixedCosts') }}
          <input
            type="number"
            class="border py-1 px-2"
            :value="fixedCosts"
            data-testid="input-fixed-costs"
            @input="updateFixedCosts"
          >
        </label>
        <label
          v-if="!surroundingLayoutDisabledByRuntimeConfig"
          class="my-3 block"
        >
          <input
            type="checkbox"
            :checked="surroundingLayoutDisabled"
            data-testid="checkbox-disable-surrounding-layout"
            @change="$event => disableSurroundingLayout(($event.target as HTMLInputElement).checked)"
          >
          {{ $t('pages.table.disableSurroundingLayout') }}
        </label>
        <label
          v-if="!surroundingLayoutDisabledByRuntimeConfig"
          class="my-3 block"
        >
          <input
            v-model="showDynamicColors"
            type="checkbox"
            data-testid="checkbox-show-dynamic-colors"
          >
          {{ $t('pages.table.showDynamicColors') }}
        </label>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { computed, watchEffect, ref, onBeforeMount, onBeforeUnmount, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { PriceRange } from '~/components/table/PriceItem.vue'

const { size } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDate,
} = useElectricityPrices()

const { surroundingLayoutDisabled, disableSurroundingLayout, surroundingLayoutDisabledByRuntimeConfig } = useDisableSurroundingLayout()

const { queryParamValue: showDynamicColors } = useQueryParameter('dynamicColors')

const minDate = ref(DateTime.fromISO('2023-01-01').startOf('day'))
const maxDate = computed(() => {
  const dateTomorrow = DateTime.now().endOf('day').plus({ days: 1 })
  if (priceForDate(dateTomorrow, 'EPEX') === 0) {
    return DateTime.now().endOf('day')
  }
  return dateTomorrow
})

const {
  currentDate, currentDateIso,
} = useDate()

watchEffect(() => {
  if (currentDateIso.value == null) {
    return
  }
  loading.value = loadingPrices.includes(currentDateIso.value)
})
watchEffect(() => {
  if (currentDateIso.value == null) {
    return
  }
  loadForDateIso(currentDateIso.value)
  const dateIsoPrev = currentDate.value.minus({ days: 1 }).toISODate()
  if (dateIsoPrev != null) {
    loadForDateIso(dateIsoPrev)
  }
  const dateIsoNext = currentDate.value.plus({ days: 1 }).toISODate()
  if (dateIsoNext != null) {
    loadForDateIso(dateIsoNext)
  }
})

/////
// prices
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
      pricePrev: priceForDate(currentDate.value.minus({ days: 1 }).set({ hour }), 'EPEX'),
      price: priceForDate(currentDate.value.set({ hour }), 'EPEX'),
      priceNext: priceForDate(currentDate.value.plus({ days: 1 }).set({ hour }), 'EPEX'),
    })
  }
  return prices
})

const allCurrentlyDisplayedPrices = computed(() => {
  return prices.value.flatMap((p) => [
    p.pricePrev,
    p.price,
    p.priceNext,
  ])
})

const getRange = (price: number): PriceRange => {
  if (showDynamicColors.value) {
    return applyRange(price, dyanmicRanges.value)
  }
  return applyRange(price, hardcodedRanges)
}

const applyRange = (price: number, ranges: Ranges): PriceRange => {
  if (price <= ranges.lowest) {
    return 'lowest'
  }
  if (price <= ranges.lower) {
    return 'lower'
  }
  if (price <= ranges.low) {
    return 'low'
  }
  if (price <= ranges.mid) {
    return 'mid'
  }
  if (price <= ranges.high) {
    return 'high'
  }
  return 'highest'
}

type Ranges = {
  lowest: number
  lower: number
  low: number
  mid: number
  high: number
}

const hardcodedRanges = {
  lowest: -8,
  lower: 5,
  low: 10,
  mid: 15,
  high: 25,
}

const dyanmicRanges = computed(() => ({
  lowest: minPrice.value + Math.min(priceDelta.value * 0.11, 3),
  lower: minPrice.value + Math.min(priceDelta.value * 0.28, 10),
  low: minPrice.value + priceDelta.value * 0.5,
  mid: maxPrice.value - Math.min(priceDelta.value * 0.28, 10),
  high: maxPrice.value - Math.min(priceDelta.value * 0.11, 3),
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
// form elements
const route = useRoute()

const addVat = ref(false)
onMounted(() => {
  if (route.query.vat === 'true') {
    addVat.value = true
  }
})
watch(addVat, () => {
  const url = new URL(location.href)
  if (addVat.value) {
    url.searchParams.set('vat', 'true')
  } else {
    url.searchParams.delete('vat')
  }
  history.replaceState(null, '', url.toString())
})

const fixedCosts = ref<string>('')
onMounted(() => {
  const fixedCostsFromUrl = route.query.fixedCosts
  if (fixedCostsFromUrl != null && !isNaN(Number(fixedCostsFromUrl))) {
    fixedCosts.value = String(fixedCostsFromUrl)
  }
})
const updateFixedCosts = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (isNaN(Number(target.value))) {
    fixedCosts.value = ''
  } else {
    fixedCosts.value = target.value
  }
}
watch(fixedCosts, () => {
  const url = new URL(location.href)
  if (fixedCosts.value === '') {
    url.searchParams.delete('fixedCosts')
  } else {
    url.searchParams.set('fixedCosts', fixedCosts.value)
  }
  history.replaceState(null, '', url.toString())
})

const getFixedCosts = () => {
  if (fixedCosts.value !== '' && !isNaN(Number(fixedCosts.value))) {
    return Number(fixedCosts.value)
  }
  return 0
}

const addFixedCostsAndVat = (price: number) => {
  let priceWithFixedCosts = price + getFixedCosts()

  if (addVat.value) {
    priceWithFixedCosts *= 1.2
  }
  return priceWithFixedCosts
}

/////
// reload data after one hour
const currentHour = DateTime.now().toFormat('yyyy-LL-dd HH')
const reconnectOnVisibilityChange = () => {
  if (
    document.visibilityState !== 'visible'
    || DateTime.now().toFormat('yyyy-LL-dd HH') === currentHour
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
