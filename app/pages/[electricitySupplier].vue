<template>
  <PageBarchart
    :electricity-supplier="electricitySupplier"
  />
</template>

<script setup lang="ts">
const route = useRoute()

const electricitySupplier = computed(() => {
  if (
    typeof route.params.electricitySupplier === 'string'
    && route.params.electricitySupplier.length > 0
  ) {
    return route.params.electricitySupplier
  }
  return undefined
})
</script>
