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
  <UNavigationMenu
    :items="configureCustomTariff"
    orientation="vertical"
    class="mt-2"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem, SelectItem } from '@nuxt/ui'

import { noFees } from '~/assets/grids/noFees'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const {
  availableGrids,
  selectedGrid,
  customGrid,
} = useGridFees()
const tml = useTranslateMultilingualString()

const gridFeeItems = computed<SelectItem[]>(() => {
  const grids = availableGrids.value
    .map((grid) => ({
      label: tml(grid.label),
      value: grid.id,
      icon: 'i-lucide-chart-column',
    }))
    .sort((gridA, gridB) => {
      if (gridA.value === noFees.id) {
        return -1
      }
      if (gridB.value === noFees.id) {
        return 1
      }
      if (gridA.label === gridB.label) {
        return 0
      }
      if (gridA.label == null) {
        return -1
      }
      if (gridB.label == null) {
        return 1
      }
      return gridA.label > gridB.label ? 1 : -1
    })

  let customGridLabel = t('gridFees.customGrid.label')
  if (customGrid.value.label) {
    customGridLabel = `${customGrid.value.label}`
  }

  return [
    ...grids,
    {
      type: 'separator',
    },
    {
      type: 'label',
      label: t('gridFees.customGrid.label'),
    },
    {
      label: customGridLabel,
      value: 'custom',
      icon: 'i-lucide-edit-2',
    },
  ]
})

const configureCustomTariff = computed<NavigationMenuItem[]>(() => [
  {
    label: t('navigation.configureCustomGrid'),
    to: {
      path: localePath('/settings/custom-grid'),
      query: route.query,
    },
    icon: 'i-lucide-edit-2',
  },
])
</script>
