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
            Powerchart
          </TypoHeadline>
        </figure>
      </template>

      <UNavigationMenu :items="items" />

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
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

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Energie Steiermark',
    to: '/',
    icon: 'i-lucide-lightbulb',
  }, {
    label: 'Awattar',
    to: '/awattar',
    icon: 'i-lucide-lightbulb',
  }, {
    label: 'Table',
    to: '/table',
    icon: 'i-lucide-table',
  },
])
</script>
