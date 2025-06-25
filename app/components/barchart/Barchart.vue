<template>
  <g>
    <g>
      <BarchartBar
        v-for="(bar) in bars"
        :key="`bar_${bar.label}`"
        :x="getBarPositionX(bar.label) || 0"
        :bar-width="getBarPositionX.bandwidth()"
        :chart-height="chartHeight"
        :total-price="bar.totalPrice"
        :max-total-price="maxTotalPrice"
        :segments="bar.segments"
        :negative-segment="bar.negativePriceSegment"
        :data-testid="`bar_${bar.label}`"
      />
    </g>
    <BarchartAxisLeft
      :chart-height="chartHeight"
      :max-total-price="maxTotalPrice"
    />
    <BarchartAxisBottom
      :chart-height="chartHeight"
      :chart-width="chartWidth"
      :labels="bars.map((bar) => bar.label)"
    />
  </g>
</template>

<script setup lang="ts">
import { scaleBand } from 'd3-scale'
import { DateTime } from 'luxon'

import type { BarSegment } from '~/types/BarSegment'

const props = defineProps({
  chartHeight: {
    type: Number,
    required: true,
  },
  chartWidth: {
    type: Number,
    required: true,
  },
  date: {
    type: Object as PropType<DateTime>,
    required: true,
  },
  vat: {
    type: Number,
    default: 0.2,
  },
})

const { priceForTimestamp } = useElectricityPrices()
const gridFees = useGridFees()
const { getFeeForDateTime, getColorForFeeId } = gridFees
const { fees } = storeToRefs(gridFees)

const bars = computed(() => hourlyTimestampsForCurrentDate.value.map((timestamp) => {
  const price = priceForTimestamp(timestamp)
  const feeSegments = feeSegmentsForTimestamp(timestamp)
  const totalPriceBeforeVat = calculateTotalPriceBeforeVat(price, feeSegments)
  const vat = totalPriceBeforeVat * props.vat
  return {
    label: labelForTimestamp(timestamp),
    totalPrice: totalPriceBeforeVat + vat,
    segments: buildBarSegments(price, feeSegments, vat),
    negativePriceSegment: buildNegativePriceSegment(price),
  }
}))

const hourlyTimestampsForCurrentDate = computed(() => {
  const timestamps = []
  const first = props.date.startOf('day').toMillis()
  const last = props.date.set({ hour: 23 }).toMillis()
  for (let current = first; current <= last; current += 1000 * 60 * 60) {
    timestamps.push(current)
  }
  return timestamps
})

const currentDateHasTimezoneShift = computed(() => hourlyTimestampsForCurrentDate.value.length !== 24)

const maxTotalPrice = computed(() => {
  const max = Math.max(
    35, // even if all bars are below this value, we draw the y axis (price ct/kwH) to this value
    ...bars.value.map((bar) => bar.totalPrice),
  )
  return max * 1.2 // add some space above the highest bar
})

const labelForTimestamp = (timestamp: number) => {
  const date = DateTime.fromMillis(timestamp)
  const timeFormatted = [date.toLocaleString(DateTime.TIME_24_SIMPLE)]
  if (currentDateHasTimezoneShift.value) {
    const timezoneLabel = date.toFormat('ZZZZZ') === 'Central European Summer Time' ? 'SZ' : 'NZ'
    timeFormatted.push(timezoneLabel)
  }
  return timeFormatted.join(' ')
}

const buildBarSegments = (
  price: number,
  feeSegments: BarSegment[],
  vat: number,
) => {
  const feeSegmentsNormalized = subtractNegativePriceFromFeeSegments(price, feeSegments)
  return [
    {
      value: vat,
      color: '#9A998C',
      label: 'vat',
    },
    ...feeSegmentsNormalized,
    {
      value: price,
      color: '#FFCB47',
      label: 'price',
    },
  ].filter((segment) => segment.value > 0)
}

const feeSegmentsForTimestamp = (timestamp: number): BarSegment[] => fees.value
  .map((fee) => ({
    value: getFeeForDateTime(fee.id, DateTime.fromMillis(timestamp)),
    color: getColorForFeeId(fee.id),
    label: fee.id,
  }))
  .filter((fee) => fee.value > 0)

const calculateTotalPriceBeforeVat = (price: number, fees: BarSegment[]) => fees
  .reduce((total, fee) => total + fee.value, price)

const subtractNegativePriceFromFeeSegments = (price: number, fees: BarSegment[]) => {
  const normalizedFees = [...fees]
  for (
    let x = fees.length - 1;
    x >= 0 && price < 0;
    x -= 1
  ) {
    const fee = fees[x] as BarSegment
    const feeReduction = Math.min(fee.value, Math.abs(price))
    price += feeReduction
    normalizedFees[x] = {
      ...fee,
      value: fee.value - feeReduction,
    }
  }
  return normalizedFees
}

const buildNegativePriceSegment = (price: number) => {
  if (price >= 0) {
    return null
  }
  return {
    value: Math.abs(price),
    color: '#FFCB47',
    label: 'negative-price',
  }
}

const getBarPositionX = computed(() => scaleBand()
  .domain(bars.value.map((bar) => bar.label))
  .range([0, props.chartWidth])
  .padding(0.2))
</script>
