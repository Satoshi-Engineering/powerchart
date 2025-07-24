<template>
  <UContainer class="max-w-xl">
    <div>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.name')"
      >
        <UInput
          :model-value="customTariff.name"
          class="w-full"
          :placeholder="$t('electricityProvider.customTariff')"
          @update:model-value="customTariff = {
            id: customTariff.id,
            name: String($event),
            provider: customTariff.provider,
            formula: customTariff.formula,
          }"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.provider')"
      >
        <UInput
          :model-value="customTariff.provider"
          class="w-full"
          :placeholder="$t('electricityProvider.customProvider')"
          @update:model-value="customTariff = {
            id: customTariff.id,
            name: customTariff.name,
            provider: String($event),
            formula: customTariff.formula,
          }"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.formula')"
      >
        <UInput
          :model-value="customTariff.formula"
          class="w-full"
          placeholder="price"
          @update:model-value="customTariff = {
            id: customTariff.id,
            name: customTariff.name,
            provider: customTariff.provider,
            formula: String($event),
          }"
        />
      </UFormField>
      <pre>
        <code>
price = 1.5
{{ customTariff.formula }} = {{ priceForFormula(1.5, customTariff.formula) }}

price = 0
{{ customTariff.formula }} = {{ priceForFormula(0, customTariff.formula) }}

price = -3
{{ customTariff.formula }} = {{ priceForFormula(-3, customTariff.formula) }}
        </code>
      </pre>
      <TypoParagraph>
        {{ $t('electricityProvider.customTariffFormulaDescription') }}
      </TypoParagraph>
      <pre>
        <code>
price + abs(price) * 0.03

price + 1.2

price * 2
        </code>
      </pre>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {
  customTariff,
  priceForFormula,
} = useElectricityProviders()
</script>
