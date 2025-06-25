<template>
  <TypoHeadline
    level="h4"
  >
    {{ $t('gridFees.selectGrid') }}
  </TypoHeadline>
  <USelect
    v-model="selectedGrid"
    class="w-full"
    :items="gridFeeItems"
    data-testid="grid-fees-select"
  />
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const { availableGrids, selectedGrid } = storeToRefs(useGridFees())
const tml = useTranslateMultilingualString()

const gridFeeItems = computed<SelectItem[]>(() => {
  const tariffs = availableGrids.value.map((grid) => ({
    label: tml(grid.label),
    value: grid.id,
    icon: 'i-lucide-chart-column',
  }))

  return [
    ...tariffs,
  ]
})
</script>
