<template>
  <div class="flex-1 flex flex-col items-center overflow-hidden">
    <UContainer>
      <div class="relative w-full flex mt-4 px-2 justify-left md:justify-center">
        <button
          class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 mx-2 py-2 px-4 rounded-l disabled:opacity-50"
          :disabled="!prevDateValid || (currentDateIso != null && loadingPrices.includes(currentDateIso))"
          @click="selectPrevDate"
        >
          {{ type === 'xs' ? '<' : $t('components.datepicker.previous') }}
        </button>
        <label class="bg-gray-300 py-2 px-4">
          <input
            type="date"
            class="bg-transparent outline-none"
            :value="currentDateIso"
            :min="(minDate.toISODate() as string)"
            :max="(maxDate.toISODate() as string)"
            @change="selectDate"
          >
        </label>
        <button
          class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 mx-2 py-2 px-4 rounded-r disabled:opacity-50"
          :disabled="!nextDateValid || (currentDateIso != null && loadingPrices.includes(currentDateIso))"
          data-testid="button-next-day"
          @click="selectNextDate"
        >
          {{ type === 'xs' ? '>' : $t('components.datepicker.next') }}
        </button>
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
            <template v-if="currentDateHasTimezoneShift">
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
      v-else-if="showContent && currentDateIso != null && loadingFailed.includes(currentDateIso)"
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
          :date="currentDate"
          :electricity-supplier="props.electricitySupplier"
          :fee-ids="Object.keys(feeById).filter((feeId) => !excludeFees.includes(feeId))"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { computed, watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  electricitySupplier: {
    type: String,
    default: undefined,
  },
})

const route = useRoute()
const { t } = useI18n()
const config = useRuntimeConfig()

const { width: clientWidth, height: clientHeight, type } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const { feeById } = useElectricityFees()
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDate,
} = useElectricityPrices()

const minDate = ref(DateTime.fromISO('2023-01-01').startOf('day'))
const maxDate = computed(() => {
  const dateTomorrow = DateTime.now().endOf('day').plus({ days: 1 })
  if (priceForDate(dateTomorrow, props.electricitySupplier) === 0) {
    return DateTime.now().endOf('day')
  }
  return dateTomorrow
})

const {
  currentDate, currentDateIso,
  selectDate, selectPrevDate, selectNextDate,
  prevDateValid, nextDateValid,
} = useDatePicker(minDate, maxDate)

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

const margins = computed(() => {
  let margins = { top: 100, right: 40, bottom: 100, left: 60 }
  if (type.value === 'xs') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  if (type.value === 'md') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  return margins
})
const chartWidth = computed(() => Math.max(800, Math.min(1800, clientWidth.value - margins.value.left - margins.value.right)))
const chartHeight = computed(() => {
  const heightReduction = config.public.disableSurroundingLayout ? 70 : 180
  return clientHeight.value - heightReduction - margins.value.top - margins.value.bottom
})

const excludeFees = computed(() => {
  let excludeFeesLocal: string[] = []
  if (typeof route.query.excludeFees === 'string') {
    excludeFeesLocal = route.query.excludeFees.split(',')
  }
  if (props.electricitySupplier != null) {
    excludeFeesLocal.push('infrastructureFee')
  }
  return excludeFeesLocal
})

const hourlyTimestampsForCurrentDate = computed(() => {
  const timestamps = []
  const first = currentDate.value.toMillis()
  const last = currentDate.value.set({ hour: 23 }).toMillis()
  for (let current = first; current <= last; current += 1000 * 60 * 60) {
    timestamps.push(current)
  }
  return timestamps
})

const currentDateHasTimezoneShift = computed(() => hourlyTimestampsForCurrentDate.value.length !== 24)

// info about colors
const showInfo = ref(false)
const infos = computed(() => [
  {
    id: 'salesTax',
    color: ELECTRICITY_TAX_COLOR,
    label: t('priceComponents.salesTax'),
  },
  ...Object.values(feeById).filter((fee) => !excludeFees.value.includes(fee.id)).reverse(),
  {
    id: 'power',
    color: ELECTRICITY_PRICE_COLOR,
    label: t('priceComponents.labelPrice'),
  },
])
</script>
