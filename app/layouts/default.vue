<script setup lang="ts">
import IconLogo from '~/components/icon/IconLogo.vue'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <UHeader>
      <template #title>
        <figure class="flex items-center gap-4">
          <IconLogo
            class="w-10 h-10"
          />
          <TypoHeadline
            level="h1"
            class="!my-0"
          >
            Powerchart
          </TypoHeadline>
        </figure>
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
