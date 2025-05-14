<template>
  <g>
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
import { computed } from 'vue'

const props = defineProps({
  segments: {
    type: Array as PropType<{
      value: number
      color: string
    }[]>,
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
  maxTotalValue: {
    type: Number,
    required: true,
  },
})

const totalValue = computed(() =>
  props.segments.reduce((sum, seg) => sum + seg.value, 0),
)

const barHeight = computed(() =>
  (totalValue.value / props.maxTotalValue) * props.chartHeight,
)

const positionedSegments = computed(() => {
  let currentY = props.chartHeight - barHeight.value
  return props.segments.map((segment) => {
    const height = (segment.value / totalValue.value) * barHeight.value
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
