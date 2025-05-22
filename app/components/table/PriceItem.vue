<template>
  <div
    class="
      flex items-center justify-center
      rounded-md border-1 border-transparent
    "
    :class="{
      'bg-green-400': priceRange === 'lowest',
      'bg-green-200': priceRange === 'lower',
      'bg-yellow-100': priceRange === 'low',
      'bg-orange-200': priceRange === 'mid',
      'bg-red-300': priceRange === 'high',
      'bg-red-500': priceRange === 'highest',
      '!border-black font-bold': isCurrentHour,
    }"
  >
    {{ $n(price, 'decimal') }}
  </div>
</template>

<script setup lang="ts">
export type PriceRange =
  'lowest'
  | 'lower'
  | 'low'
  | 'mid'
  | 'high'
  | 'highest'

defineProps({
  price: {
    type: Number,
    required: true,
  },
  isCurrentHour: {
    type: Boolean,
    default: false,
  },
  priceRange: {
    type: String as PropType<PriceRange>,
    required: true,
  },
})
</script>
