<template>
  <g ref="axis" />
</template>

<script setup lang="ts">
import { axisLeft } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'

const props = defineProps({
  chartHeight: {
    type: Number,
    required: true,
  },
  maxTotalPrice: {
    type: Number,
    required: true,
  },
})

const getPositions = computed(() => scaleLinear()
  .domain([0, props.maxTotalPrice])
  .range([props.chartHeight, 0]))

const axis = ref<HTMLElement>()
watchEffect(() => {
  if (axis.value == null) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(axis.value).call(axisLeft(getPositions.value) as any)
})
</script>
