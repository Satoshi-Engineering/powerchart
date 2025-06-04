<template>
  <div
    class="
      flex items-center justify-center
      rounded-md border-1 border-transparent
    "
    :class="{
      'bg-green-400': priceRange === 'lowest' && !loading,
      'bg-green-200': priceRange === 'lower' && !loading,
      'bg-yellow-100': priceRange === 'low' && !loading,
      'bg-orange-200': priceRange === 'mid' && !loading,
      'bg-red-300': priceRange === 'high' && !loading,
      'bg-red-500': priceRange === 'highest' && !loading,
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
  'lowest'
  | 'lower'
  | 'low'
  | 'mid'
  | 'high'
  | 'highest'

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
