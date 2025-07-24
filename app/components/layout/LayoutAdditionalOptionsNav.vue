<template>
  <TypoHeadline
    level="h4"
    class="mt-5"
  >
    {{ $t('sidebar.additionalOptions') }}
  </TypoHeadline>

  <UCheckbox
    v-model="addVatRef"
    :label="$t('sidebar.addVat')"
    data-testid="add-vat-checkbox"
    @update:model-value="addVat = !!$event"
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
// https://gitlab.satoshiengineering.com/satoshiengineering/powerchart/-/jobs/46587
// Workaround!
// Assigning the addVat writableComputed directly to the UCheckbox will not change the value immediately on click
// and then the playwright "check" and "uncheck" helpers won't work. So we use a local ref instead.
const addVatRef = ref(addVat.value)

const {
  surroundingLayoutDisabled,
  disableSurroundingLayout,
} = useDisableSurroundingLayout()
</script>
