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
    { name: 'apple-mobile-web-app-title', content: config.public.appTitle },
    ...(i18nHead.value.meta || []),
  ],
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - ${config.public.appTitle}` : config.public.appTitle,
})

const layout = computed<LayoutKey>(() => config.public.disableSurroundingLayout ? 'no-surrounding' : 'default')
</script>
