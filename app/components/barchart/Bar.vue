<template>
  <g :transform="`translate(${x}, ${chartHeight - barHeight})`">
    <text
      font-size="12"
      font-family="sans-serif"
      text-anchor="middle"
      data-testid="bar-total-price"
      :transform="`translate(${barWidth / 2}, -7)`"
    >
      {{ formatNumber(totalPrice, 2, 2) }}
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
// todo : handle negative price

import { computed } from 'vue'

import type { BarSegment } from '~/types/BarSegment'

const props = defineProps({
  x: {
    type: Number,
    required: true,
  },
  barWidth: {
    type: Number,
    required: true,
  },
  chartHeight: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  // the total price of the largest bar is used to calculate the height of all bars
  maxTotalPrice: {
    type: Number,
    required: true,
  },
  segments: {
    type: Array as PropType<BarSegment[]>,
    required: true,
  },
})

const { formatNumber } = useFormatNumber()

const barHeight = computed(() => Math.max(
  0,
  (props.totalPrice / props.maxTotalPrice) * props.chartHeight,
))

const positionedSegments = computed(() => {
  let currentY = 0
  return props.segments.map((segment) => {
    const height = (segment.value / props.totalPrice) * barHeight.value
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
