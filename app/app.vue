<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
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
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - Powerchart` : 'Powerchart',
})
</script>
