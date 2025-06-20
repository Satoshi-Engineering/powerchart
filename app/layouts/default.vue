<template>
  <div
    class="min-h-dvh flex flex-col"
    data-testid="the-default-layout"
  >
    <div data-testid="layout-header">
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
          <figure
            class="flex items-center gap-4"
            data-testid="layout-header-logo"
          >
            <IconLogo
              class="w-10 h-10"
            />
            <TypoHeadline
              level="h1"
              class="!my-0 text-base md:text-2xl"
            >
              {{ $config.public.app.title }}
            </TypoHeadline>
          </figure>
        </template>

        <template #body>
          <div data-testid="layout-nav-menu">
            <UNavigationMenu
              :items="viewItems"
              orientation="vertical"
            />
          </div>

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
            data-testid="electricity-provider-select"
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
    </div>
    <UMain
      class="flex-1 min-h-none"
      data-testid="layout-main"
    >
      <slot />
    </UMain>
    <UFooter data-testid="layout-footer">
      <UNavigationMenu
        :items="footerLinks"
        variant="link"
      />

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

const tml = useTranslateMultilingualString()
const config = useRuntimeConfig()
const footerLinks = computed<NavigationMenuItem[]>(() => {
  const links = [{
    label: 'GitHub',
    to: config.public.githubUrl,
    target: '_blank',
    icon: 'i-lucide-github',
  }]

  const legalNoticeUrl = tml(config.public.legalNoticeUrl)
  if (legalNoticeUrl?.startsWith('http')) {
    links.unshift({
      label: t('navigation.legalNotice'),
      to: legalNoticeUrl,
      target: '_blank',
      icon: 'i-lucide-file-text',
    })
  }

  const privacyPolicyUrl = tml(config.public.privacyPolicyUrl)
  if (privacyPolicyUrl?.startsWith('http')) {
    links.unshift({
      label: t('navigation.privacyPolicy'),
      to: privacyPolicyUrl,
      target: '_blank',
      icon: 'i-lucide-file-text',
    })
  }

  return links
})
</script>
