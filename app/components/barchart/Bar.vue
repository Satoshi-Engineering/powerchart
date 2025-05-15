<template>
  <g :transform="`translate(${x}, ${chartHeight - barHeight})`">
    <text
      font-size="12"
      font-family="sans-serif"
      text-anchor="middle"
      data-testid="bar-total-price"
      :transform="`translate(${barWidth / 2}, -7)`"
    >
      {{ formatNumber(totalPriceAfterVat, 2, 2) }}
    </text>
    <rect
      v-for="(segment, index) in positionedSegments"
      :key="index"
      :x="0"
      :y="segment.y"
      :width="barWidth"
      :height="segment.height"
      :fill="segment.color"
    />
  </g>
</template>

<script setup lang="ts">
// todo : fix bar width and spacing
// todo : handle negative price

import type { DateTime } from 'luxon'
import { computed } from 'vue'

import type { Fee } from '~~/app/assets/fees'

const props = defineProps({
  chartHeight: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  date: {
    type: Object as PropType<DateTime>,
    required: true,
  },
  // the total price of the largest bar
  // used to calculate the height of the bar
  // based on the percentage of the total value
  maxTotalValue: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  feeIds: {
    type: Array as PropType<Fee['id'][]>,
    required: true,
  },
  vat: {
    type: Number,
    default: 0.2,
  },
  barWidth: {
    type: Number,
    required: true,
  },
})

const { feeForDate, colorForFeeId } = useElectricityFees()
const { formatNumber } = useFormatNumber()

const priceSegments = computed(() => [
  {
    value: totalPriceBeforeVat.value * props.vat,
    color: '#9A998C',
  },
  ...feeSegments.value,
  {
    value: props.price,
    color: '#FFCB47',
  },
].filter((segment) => segment.value > 0))

const feeSegments = computed(() => props.feeIds.map((feeId) => ({
  value: feeForDate(feeId, props.date),
  color: colorForFeeId(feeId),
})))

const totalPriceBeforeVat = computed(() => props.feeIds.reduce((total, feeId) => {
  const fee = feeForDate(feeId, props.date)
  return total + fee
}, props.price))

const totalPriceAfterVat = computed(() => totalPriceBeforeVat.value * (1 + props.vat))

const barHeight = computed(() => (totalPriceAfterVat.value / props.maxTotalValue) * props.chartHeight)

const positionedSegments = computed(() => {
  let currentY = 0
  return priceSegments.value.map((segment) => {
    const height = (segment.value / totalPriceAfterVat.value) * barHeight.value
    const y = currentY
    currentY += height
    return {
      height,
      y,
      color: segment.color,
    }
  })
})
</script>
