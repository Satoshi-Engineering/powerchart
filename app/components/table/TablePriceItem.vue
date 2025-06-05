<template>
  <div
    class="
      flex items-center justify-center
      rounded-md border-1 border-transparent
    "
    :class="{
      'bg-green-300': priceRange === 'lowAlert' && !loading,
      'bg-green-200': priceRange === 'lowest' && !loading,
      'bg-lime-100': priceRange === 'lower' && !loading,
      'bg-yellow-100': priceRange === 'low' && !loading,
      'bg-orange-100': priceRange === 'mid' && !loading,
      'bg-orange-200': priceRange === 'high' && !loading,
      'bg-red-200': priceRange === 'highest' && !loading,
      'bg-red-300': priceRange === 'highAlert' && !loading,
      'bg-gray-200': loading,
      '!border-black font-bold': isCurrentHour,
    }"
  >
    {{ loading ? '' : $n(price, 'decimal') }}
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export type PriceRange =
  'lowAlert'
  | 'lowest'
  | 'lower'
  | 'low'
  | 'mid'
  | 'high'
  | 'highest'
  | 'highAlert'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
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
