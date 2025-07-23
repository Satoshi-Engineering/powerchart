<template>
  <TypoHeadline
    level="h4"
  >
    {{ $t('electricityProvider.selectTariff') }}
  </TypoHeadline>
  <USelect
    :model-value="selectedTariff"
    :items="electricityProviderItems"
    class="w-full"
    data-testid="electricity-provider-select"
    @update:model-value="electricityProviders.setSelectedTariff(String($event))"
  />
  <UNavigationMenu
    :items="configureCustomTariff"
    orientation="vertical"
    class="mt-2"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem, SelectItem } from '@nuxt/ui'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const electricityProviders = useElectricityProviders()
const {
  availableTariffs,
  selectedTariff,
  customTariff,
} = storeToRefs(electricityProviders)

const electricityProviderItems = computed<SelectItem[]>(() => {
  const tariffs = availableTariffs.value.map((tariff) => ({
    label: `${tariff.name} - ${tariff.provider}`,
    value: tariff.id,
    icon: 'i-lucide-sun',
  }))

  let label = t('electricityProvider.customTariff')
  if (customTariff.value.name) {
    label = `${customTariff.value.name}`
  }
  if (customTariff.value.provider) {
    label += ` - ${customTariff.value.provider}`
  }
  return [
    ...tariffs,
    {
      type: 'separator',
    },
    {
      type: 'label',
      label: t('electricityProvider.customTariff'),
    },
    {
      label,
      value: 'custom',
      icon: 'i-lucide-edit-2',
    },
  ]
})

const configureCustomTariff = computed<NavigationMenuItem[]>(() => [
  {
    label: t('navigation.configureCustomTariff'),
    to: {
      path: localePath('/settings/custom-tariff'),
      query: route.query,
    },
    icon: 'i-lucide-edit-2',
  },
])
</script>
