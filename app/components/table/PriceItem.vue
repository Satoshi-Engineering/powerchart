<template>
  <div
    class="
      flex items-center justify-center
      rounded-md border-1 border-transparent
    "
    :class="{
      'bg-green-400': price <= thresholdLowest,
      'bg-green-200': price > thresholdLowest && price <= thresholdLow,
      'bg-yellow-100': price > thresholdLow && price <= thresholdMid,
      'bg-orange-200': price > thresholdMid && price <= thresholdHigh,
      'bg-red-300': price > thresholdHigh && price <= thresholdHighest,
      'bg-red-500': price > thresholdHighest,
      '!border-black font-bold': isCurrentHour,
    }"
  >
    {{ price.toFixed(2) }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  price: {
    type: Number,
    required: true,
  },
  isCurrentHour: {
    type: Boolean,
    default: false,
  },
  thresholdLowest: {
    type: Number,
    default: -8,
  },
  thresholdLow: {
    type: Number,
    default: 5,
  },
  thresholdMid: {
    type: Number,
    default: 10,
  },
  thresholdHigh: {
    type: Number,
    default: 15,
  },
  thresholdHighest: {
    type: Number,
    default: 25,
  },
})
</script>
