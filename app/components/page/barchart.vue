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
      v-else-if="showContent"
      class="w-full overflow-x-auto"
      data-testid="electricity-price-chart"
    >
      <svg
        class="mx-auto"
        :width="width + margins.left + margins.right"
        :height="height + margins.top + margins.bottom"
      >
        <g :transform="`translate(${margins.left}, ${margins.top})`">
          <g>
            <BarchartBar
              v-for="(bar, index) in data"
              :key="bar.id"
              :transform="`translate(${index * (x.bandwidth() + 15) + 20}, 0)`"
              :chart-height="height"
              :max-total-value="44"
              :bar-width="x.bandwidth() - 10"
              :segments="infos.map((info) => ({
                value: Number(bar[info.id]),
                color: info.color,
              }))"
            />
          </g>
          <g ref="vAxisLeft" />
          <g
            ref="vAxisBottom"
            :transform="`translate(0, ${height})`"
            data-testid="x-axis"
          />
          <g
            :font-size="type === 'xs' ? '10' : '12'"
            font-family="sans-serif"
            text-anchor="middle"
            data-testid="bar-labels"
          >
            <text
              v-for="bar in barsTotal"
              :key="bar.key"
              fill="currentColor"
              :y="y(Math.max(bar.value, 0)) - 5"
              :x="(x(bar.group) || -5000) + x.bandwidth() / 2"
            >{{ formatNumber(bar.value, 2, 2) }}</text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
// import { stack } from 'd3-shape'
import { scaleBand, scaleLinear } from 'd3-scale'
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

const { formatNumber } = useFormatNumber()
const route = useRoute()
const { t } = useI18n()
const { info } = useDebugInfo()
const config = useRuntimeConfig()

const { width: clientWidth, height: clientHeight, type } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const { feeForDate, feeById } = useElectricityFees()
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDate, priceForTimestamp,
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
  loading.value = loadingPrices.value.includes(currentDateIso.value)
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

// const colorsByBarKey = computed<Record<string, string>>(() => ({
//   ...Object.entries(feeById).reduce((accumulator, [key, fee]) => ({
//     ...accumulator,
//     [key]: fee.color,
//   }), {}),
//   power: ELECTRICITY_PRICE_COLOR,
//   salesTax: ELECTRICITY_TAX_COLOR,
// }))

const margins = computed(() => {
  let margins = { top: 100, right: 40, bottom: 100, left: 60 }
  if (type.value === 'xs') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  if (type.value === 'md') {
    margins = { top: 20, right: 10, bottom: 30, left: 30 }
  }
  const maxNegative = max(negativeBars.value.map((data) => Math.abs(data.power))) || 0
  if (maxNegative > 0) {
    const minMarginBottom = (clientHeight.value - 70 - margins.top) * (maxNegative / (maxNegative + 35))
    margins.bottom = Math.max(minMarginBottom, margins.bottom)
  }
  return margins
})
const width = computed(() => Math.max(800, Math.min(1800, clientWidth.value - margins.value.left - margins.value.right)))
const height = computed(() => {
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

const negativeBars = computed(() =>
  hourlyTimestampsForCurrentDate.value
    .filter((timestamp) => priceForTimestamp(timestamp, props.electricitySupplier) < 0)
    .map((timestamp) => {
      const power = priceForTimestamp(timestamp, props.electricitySupplier)
      const group = labelForTimestamp(timestamp)
      return {
        key: `negative_price_${group}`,
        group,
        power: power / 10, // scale down the negative bars to make the diagram prettier
      }
    }),
)

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

const labelForTimestamp = (timestamp: number) => {
  const date = DateTime.fromMillis(timestamp)
  const timeFormatted = [date.toLocaleString(DateTime.TIME_24_SIMPLE)]
  if (currentDateHasTimezoneShift.value) {
    const timezoneLabel = date.toFormat('ZZZZZ') === 'Central European Summer Time' ? 'SZ' : 'NZ'
    timeFormatted.push(timezoneLabel)
  }
  return timeFormatted.join(' ')
}

const data = computed<Record<string, string | number>[]>(() => hourlyTimestampsForCurrentDate.value.map((timestamp) => {
  const usedDate = DateTime.fromMillis(timestamp)
  const values: Record<string, number> = {}

  info('\n\n\n')
  info(`Calculating values for: ${usedDate.toISOTime()}`)

  const power = priceForTimestamp(timestamp, props.electricitySupplier)
  values.power = Math.max(power, 0)
  Object.keys(feeById).forEach((feeId) => {
    if (excludeFees.value.includes(feeId)) {
      return
    }
    values[feeId] = feeForDate(feeId, usedDate)
  })
  if (power < 0) {
    let powerSubtracted = 0
    Object.keys(feeById).forEach((feeId) => {
      if (excludeFees.value.includes(feeId) || values[feeId] == null) {
        return
      }
      const powerToSubtract = Math.min(Math.abs(power) - powerSubtracted, values[feeId])
      powerSubtracted += powerToSubtract
      values[feeId] -= powerToSubtract
    })
    values.power = power + powerSubtracted
  }
  values.salesTax = Object.values(values).reduce((total, current) => total + current, 0) * 0.2

  info('values in Ct/KWh')
  info(JSON.stringify(values, undefined, '  '))
  info(`total: ${Object.values(values).reduce((total, current) => total + current, 0)}`)

  return {
    group: labelForTimestamp(timestamp),
    ...values,
  }
}))
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// ;(window as any).logData = () => {
//   console.log(data.value)
// }
// const subgroups = computed(() => {
//   const firstEntry = data.value[0]
//   if (firstEntry == null) {
//     return []
//   }
//   return Object.keys(firstEntry).filter((subgroup) => subgroup !== 'group')
// })
const groups = computed(() => data.value.map((point) => String(point.group)))
const maxY = computed(() => data.value
  .map((values) => Object.values(values).reduce((total: number, value: string | number) => {
    if (typeof value === 'number') {
      return total + value
    }
    return total
  }, 0))
  .reduce((max, value) => {
    if (value > max) {
      return value
    }
    return max
  }, 0))

const x = computed(() => scaleBand()
  .domain(groups.value)
  .range([0, width.value])
  .padding(0.2))
const y = computed(() => scaleLinear()
  .domain([0, Math.max(35, maxY.value * 1.2)])
  .range([height.value, 0]))

const vAxisLeft = ref<HTMLElement>()
watchEffect(() => {
  if (vAxisLeft.value == null) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(vAxisLeft.value).call(axisLeft(y.value) as any)
})

const vAxisBottom = ref<HTMLElement>()
watchEffect(() => {
  if (vAxisBottom.value == null) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(vAxisBottom.value).call(axisBottom(x.value).tickSizeOuter(0) as any)
})

const barsTotal = computed(() => data.value.map((values) => {
  const value = Object.entries(values).reduce((total: number, [, value]) => {
    if (typeof value !== 'number') {
      return total
    }
    return total + value
  }, 0)
  return {
    key: `valuesTotal_${values.group}`,
    group: String(values.group),
    value,
  }
}))

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const stackedData = computed(() => stack().keys(subgroups.value)(data.value as any))

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
