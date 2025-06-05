<template>
  <UContainer class="max-w-xl">
    <div>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.name')"
      >
        <UInput
          v-model="electricityProviders.customName"
          class="w-full"
          :placeholder="$t('electricityProvider.customTariff')"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.provider')"
      >
        <UInput
          v-model="electricityProviders.customProvider"
          class="w-full"
          :placeholder="$t('electricityProvider.customProvider')"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.formula')"
      >
        <UInput
          v-model="electricityProviders.customFormula"
          class="w-full"
          placeholder="price"
        />
      </UFormField>
      <pre>
        <code>
price = 1.5
{{ electricityProviders.customFormula }} = {{ electricityProviders.priceForCustomFormula(1.5) }}

price = 0
{{ electricityProviders.customFormula }} = {{ electricityProviders.priceForCustomFormula(0) }}

price = -3
{{ electricityProviders.customFormula }} = {{ electricityProviders.priceForCustomFormula(-3) }}
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
const electricityProviders = useElectricityProviders()
</script>
