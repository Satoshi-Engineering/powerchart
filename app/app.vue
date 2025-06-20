<template>
  <UApp>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import type { LayoutKey } from '#build/types/layouts'

const config = useRuntimeConfig()
const { surroundingLayoutDisabled } = useDisableSurroundingLayout()

const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})
useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [
    { name: 'apple-mobile-web-app-title', content: config.public.app.title },
    ...(i18nHead.value.meta || []),
  ],
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - ${config.public.app.title}` : config.public.app.title,
})

const layout = computed<LayoutKey>(() => surroundingLayoutDisabled.value ? 'no-surrounding' : 'default')

const { locale } = useI18n()
watch(locale, (newLocale) => {
  document.documentElement.setAttribute('lang', newLocale)
})
</script>
