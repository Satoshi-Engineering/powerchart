<template>
  <TypoHeadline
    level="h4"
    class="mt-5"
  >
    {{ $t('sidebar.additionalOptions') }}
  </TypoHeadline>

  <UCheckbox
    v-model="addVat"
    :label="$t('sidebar.addVat')"
    data-testid="add-vat-checkbox"
  />

  <UCheckbox
    v-model="surroundingLayoutDisabled"
    class="mt-3"
    :label="$t('sidebar.disableSurroundingLayout')"
    :description="$t('sidebar.disableSurroundingLayoutDescription')"
    data-testid="disable-surrounding-layout-checkbox"
    @update:model-value="value => disableSurroundingLayout(!!value)"
  />
</template>

<script setup lang="ts">
const { addVat } = useAddVat()

const {
  surroundingLayoutDisabled,
  disableSurroundingLayout,
} = useDisableSurroundingLayout()
</script>
