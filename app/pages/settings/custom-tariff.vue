<template>
  <UContainer class="max-w-xl">
    <div>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.name')"
      >
        <UInput
          v-model="electricityProviders.customTariff.name"
          class="w-full"
          :placeholder="$t('electricityProvider.customTariff')"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.provider')"
      >
        <UInput
          v-model="electricityProviders.customTariff.provider"
          class="w-full"
          :placeholder="$t('electricityProvider.customProvider')"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('electricityProvider.formLabels.formula')"
      >
        <UInput
          v-model="electricityProviders.customTariff.formula"
          class="w-full"
          placeholder="price"
        />
      </UFormField>
      <pre>
        <code>
price = 1.5
{{ electricityProviders.customTariff.formula }} = {{ electricityProviders.priceForFormula(1.5, electricityProviders.customTariff.formula) }}

price = 0
{{ electricityProviders.customTariff.formula }} = {{ electricityProviders.priceForFormula(0, electricityProviders.customTariff.formula) }}

price = -3
{{ electricityProviders.customTariff.formula }} = {{ electricityProviders.priceForFormula(-3, electricityProviders.customTariff.formula) }}
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
