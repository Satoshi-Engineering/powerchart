<template>
  <nav data-test-id="layout-lang-nav">
    <UDropdownMenu
      :items="items"
    >
      <UButton
        icon="i-lucide-globe"
        size="md"
        variant="ghost"
        color="neutral"
        data-testid="button-lang-switch"
      >
        {{ currentLocaleName }}
      </UButton>
    </UDropdownMenu>
  </nav>
</template>

<script lang="ts" setup>
const { locale: currentLocale, locales: availableLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed(() => availableLocales.value.map((locale) => ({
  label: locale.name,
  active: locale.code === currentLocale.value,
  to: switchLocalePath(locale.code),
})))

const currentLocaleName = computed(() => {
  const locale = availableLocales.value.find((l) => l.code === currentLocale.value)
  return locale ? locale.name : ''
})
</script>
