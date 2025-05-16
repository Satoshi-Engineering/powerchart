<template>
  <UApp>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import type { LayoutKey } from '#build/types/layouts'

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
  meta: [...(i18nHead.value.meta || [])],
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - ${config.public.appTitle}` : config.public.appTitle,
})

const config = useRuntimeConfig()

const layout = computed<LayoutKey>(() => config.public.disableSurroundingLayout ? 'no-surrounding' : 'default')
</script>
