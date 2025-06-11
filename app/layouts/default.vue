<template>
  <div
    class="min-h-dvh flex flex-col"
    data-testid="app-layout"
  >
    <UHeader
      mode="slideover"
      :ui="{
        center: 'lg:hidden',
        toggle: 'lg:block',
        content: 'lg:block',
        overlay: 'lg:block',
      }"
    >
      <template #title>
        <figure class="flex items-center gap-4">
          <IconLogo
            class="w-10 h-10"
          />
          <TypoHeadline
            level="h1"
            class="!my-0 text-base md:text-2xl"
          >
            {{ $config.public.appTitle }}
          </TypoHeadline>
        </figure>
      </template>

      <template #body>
        <UNavigationMenu
          :items="viewItems"
          orientation="vertical"
        />

        <USeparator class="my-4" />

        <TypoHeadline
          level="h4"
        >
          {{ $t('electricityProvider.selectTariff') }}
        </TypoHeadline>
        <USelect
          v-model="electricityProviders.selectedTariff"
          class="w-full"
          :items="electricityProviderItems"
        />
        <UNavigationMenu
          :items="configureCustomTariff"
          orientation="vertical"
          class="mt-2"
        />
      </template>

      <template #right>
        <LayoutLangNav />
      </template>
    </UHeader>
    <UMain
      class="flex-1 min-h-none"
      data-testid="app-main"
    >
      <slot />
    </UMain>
    <UFooter data-testid="app-footer">
      <template #right>
        Version: {{ $config.public.version }}
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, SelectItem } from '@nuxt/ui'

const route = useRoute()
const viewItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t('navigation.barchart'),
    to: {
      path: '/',
      query: route.query,
    },
    icon: 'i-lucide-chart-column',
  },
  {
    label: t('navigation.table'),
    to: {
      path: '/table',
      query: route.query,
    },
    icon: 'i-lucide-table',
  },
])

const electricityProviders = useElectricityProviders()
const { t } = useI18n()

const electricityProviderItems = computed<SelectItem[]>(() => {
  const tariffs = electricityProviders.availableTariffs.map((tariff) => ({
    label: `${tariff.name} - ${tariff.provider}`,
    value: tariff.id,
    icon: 'i-lucide-sun',
  }))

  let label = t('electricityProvider.customTariff')
  if (electricityProviders.customTariff.name) {
    label = `${electricityProviders.customTariff.name}`
  }
  if (electricityProviders.customTariff.provider) {
    label += ` - ${electricityProviders.customTariff.provider}`
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
      path: '/settings/custom-tariff',
      query: route.query,
    },
    icon: 'i-lucide-edit-2',
  },
])
</script>
