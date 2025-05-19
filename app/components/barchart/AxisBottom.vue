<template>
  <g
    ref="axis"
    :transform="`translate(0, ${chartHeight})`"
    data-testid="x-axis"
  />
</template>

<script setup lang="ts">
import { axisBottom } from 'd3-axis'
import { scaleBand } from 'd3-scale'
import { select } from 'd3-selection'

const props = defineProps({
  chartHeight: {
    type: Number,
    required: true,
  },
  chartWidth: {
    type: Number,
    required: true,
  },
  labels: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const getPositions = computed(() => scaleBand()
  .domain(props.labels)
  .range([0, props.chartWidth])
  .padding(0.2))

const axis = ref<HTMLElement>()
watchEffect(() => {
  if (axis.value == null) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(axis.value).call(axisBottom(getPositions.value).tickSizeOuter(0) as any)
})
</script>
