<template>
  <TypoHeadline
    level="h4"
  >
    {{ $t('electricityProvider.selectTariff') }}
  </TypoHeadline>
  <USelect
    v-model="selectedTariff"
    class="w-full"
    :items="electricityProviderItems"
    data-testid="electricity-provider-select"
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

const {
  availableTariffs,
  selectedTariff,
  customTariff,
} = storeToRefs(useElectricityProviders())

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
