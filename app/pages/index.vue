<template>
  <div
    class="flex-1 flex flex-col items-center overflow-hidden"
    data-testid="page-index"
  >
    <UContainer>
      <div class="relative w-full flex mt-4 px-2 justify-left md:justify-center">
        <DatePicker
          v-model="selectedDate"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="selectedDateIso != null && loadingPrices.includes(selectedDateIso)"
          :size="size"
        />
        <div class="absolute right-0 h-full me-2">
          <button
            class="h-full py-2 px-4 bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
            @click="showInfo = !showInfo"
          >
            ?
          </button>
          <div
            v-if="showInfo"
            class="
                absolute right-0 top-0 max-w-sm
                grid grid-cols-[auto_auto] gap-2 items-center
                border border-gray-200 rounded
                py-2 pl-4 pr-8
                bg-white shadow
              "
            @click="showInfo = false"
          >
            <button class="absolute right-0 top-0 py-2 px-3">
              X
            </button>
            <template
              v-for="feeInfo in infos"
              :key="feeInfo.id"
            >
              <span
                class="inline-block h-3 w-3 border border-gray-200 rounded"
                :style="{ backgroundColor: feeInfo.color }"
              />
              <span class="whitespace-nowrap">{{ feeInfo.label }}</span>
            </template>
            <template v-if="selectedDateHasTimezoneShift">
              <span>SZ</span><span>Sommerzeit</span>
              <span>NZ</span><span>Normalzeit</span>
            </template>
          </div>
        </div>
      </div>
    </UContainer>
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
      v-else-if="
        showContent
          && clientHeight > 0
          && clientWidth > 0
      "
      class="w-full overflow-x-auto"
      data-testid="electricity-price-chart"
    >
      <svg
        class="mx-auto"
        :width="chartWidth + margins.left + margins.right"
        :height="chartHeight + margins.top + margins.bottom"
      >
        <Barchart
          :transform="`translate(${margins.left}, ${margins.top})`"
          :chart-height="chartHeight"
          :chart-width="chartWidth"
          :date="selectedDate"
          :vat="addVat ? 0.2 : 0"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { computed, watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { surroundingLayoutDisabled } = useDisableSurroundingLayout()

const { width: clientWidth, height: clientHeight, size } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDate,
} = useElectricityPrices()
const { fees } = useGridFees()

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
  const dateIsoNext = selectedDate.value.plus({ days: 1 }).toISODate()
  if (dateIsoNext != null) {
    loadForDateIso(dateIsoNext)
  }
})

const margins = computed(() => {
  let margins = { top: 100, right: 40, bottom: 100, left: 60 }
  if (size.value === 'xs') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  if (size.value === 'md') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  return margins
})
const chartWidth = computed(() => Math.max(800, Math.min(1800, clientWidth.value - margins.value.left - margins.value.right)))
const chartHeight = computed(() => {
  const heightReduction = surroundingLayoutDisabled.value ? 70 : 200
  return clientHeight.value - heightReduction - margins.value.top - margins.value.bottom
})

const hourlyTimestampsForCurrentDate = computed(() => {
  const timestamps = []
  const first = selectedDate.value.toMillis()
  const last = selectedDate.value.set({ hour: 23 }).toMillis()
  for (let current = first; current <= last; current += 1000 * 60 * 60) {
    timestamps.push(current)
  }
  return timestamps
})

const selectedDateHasTimezoneShift = computed(() => hourlyTimestampsForCurrentDate.value.length !== 24)

// info about colors
const { addVat } = useAddVat()
const showInfo = ref(false)
const infos = computed(() => {
  const infos = [
    ...[...fees.value].reverse(),
    {
      id: 'power',
      color: ELECTRICITY_PRICE_COLOR,
      label: t('priceComponents.labelPrice'),
    },
  ]
  if (addVat.value) {
    infos.unshift({
      id: 'vat',
      color: VAT_COLOR,
      label: t('priceComponents.salesTax'),
    })
  }
  return infos
})
</script>
