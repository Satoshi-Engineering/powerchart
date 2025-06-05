<template>
  <div class="min-h-dvh flex flex-col">
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
      </template>

      <template #right>
        <LayoutLangNav />
      </template>
    </UHeader>
    <UMain class="flex-1 min-h-none">
      <slot />
    </UMain>
    <UFooter>
      <template #right>
        Version: {{ $config.public.version }}
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const viewItems = ref<NavigationMenuItem[]>([
  {
    label: 'BarChart',
    to: '/',
    icon: 'i-lucide-chart-column',
  },
  {
    label: 'Table',
    to: '/table',
    icon: 'i-lucide-table',
  },
])

const electricityProviders = useElectricityProviders()
const { t } = useI18n()

// Type SelectItem type definition from @nuxt/ui does not allow to configure 'separator' or 'label' types,
// although it's allowed according to the documentation and works in practice.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const electricityProviderItems = computed<any[]>(() => {
  const tariffs = electricityProviders.availableTariffs.map((tariff) => ({
    label: `${tariff.name} - ${tariff.provider}`,
    value: tariff.id,
    icon: 'i-lucide-sun',
  }))

  let label = t('electricityProvider.customTariff')
  if (electricityProviders.customName) {
    label = `${electricityProviders.customName}`
  }
  if (electricityProviders.customProvider) {
    label += ` - ${electricityProviders.customProvider}`
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
</script>
