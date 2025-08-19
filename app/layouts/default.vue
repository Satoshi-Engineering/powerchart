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

          <USeparator class="my-6" />

          <LayoutElectricityProviderNav />

          <LayoutGridFeesNav />

          <LayoutAdditionalOptionsNav />
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
      <FeedbackForm v-if="config.public.feedbackFormEnabled" />

      <template #right>
        Version: {{ $config.public.version }}
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const localePath = useLocalePath()
const viewItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t('navigation.barchart'),
    to: {
      path: localePath('/'),
      query: route.query,
    },
    icon: 'i-lucide-chart-column',
  },
  {
    label: t('navigation.table'),
    to: {
      path: localePath('/table'),
      query: route.query,
    },
    icon: 'i-lucide-table',
  },
])

const { t } = useI18n()
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
