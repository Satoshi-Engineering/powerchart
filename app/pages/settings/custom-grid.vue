<template>
  <UContainer>
    <div>
      <UFormField
        class="mt-4 mb-2"
        :label="$t('gridFees.customGrid.form.name.title')"
      >
        <UInput
          v-model="label"
          class="w-full"
          :placeholder="$t('gridFees.customGrid.form.name.placeholder')"
        />
      </UFormField>
      <UFormField
        class="mt-4 mb-2"
        :description="$t('gridFees.customGrid.form.fees.description')"
        :label="$t('gridFees.customGrid.form.fees.title')"
      >
        <UTextarea
          v-model="fees"
          class="w-full"
          :rows="10"
          :placeholder="$t('gridFees.customGrid.form.fees.placeholder')"
        />
      </UFormField>
    </div>

    <UButton
      color="primary"
      class="cursor-pointer"
      :label="$t('gridFees.customGrid.form.save')"
      :disabled="!feeValidation.success"
      @click="save()"
    />
    <code v-if="feeValidation.error">
      <pre class="text-xs bg-gray-100 dark:bg-gray-800 mt-2 p-4 rounded">{{ feeValidation.error }}</pre>
    </code>

    <UCollapsible class="mt-4">
      <UButton
        label="JSON Schema"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />
      <template #content>
        <code>
          <pre class="text-xs bg-gray-100 dark:bg-gray-800 mt-2 p-4 rounded">{{ description }}</pre>
        </code>
      </template>
    </UCollapsible>
    <UCollapsible class="mt-4">
      <UButton
        :label="$t('gridFees.customGrid.form.fees.example', { example: graz.label })"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />
      <template #content>
        <code>
          <pre class="text-xs bg-gray-100 dark:bg-gray-800 mt-2 p-4 rounded">{{ JSON.stringify(graz.fees, undefined, 2) }}</pre>
        </code>
      </template>
    </UCollapsible>
    <UCollapsible class="mt-4">
      <UButton
        :label="$t('gridFees.customGrid.form.fees.example', { example: grazDoubleTariff.label })"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevron-down"
        block
      />
      <template #content>
        <code>
          <pre class="text-xs bg-gray-100 dark:bg-gray-800 mt-2 p-4 rounded">{{ JSON.stringify(grazDoubleTariff.fees, undefined, 2) }}</pre>
        </code>
      </template>
    </UCollapsible>
  </UContainer>
</template>

<script setup lang="ts">
import z from 'zod/v4'

import { graz } from '~/assets/grids/graz'
import { grazDoubleTariff } from '~/assets/grids/grazDoubleTariff'
import { Fee } from '~/types/Fee'

const { customGrid } = storeToRefs(useGridFees())

const label = ref(customGrid.value.label)
const fees = ref<string>(JSON.stringify(customGrid.value.fees, null, 2))

const description = z.toJSONSchema(Fee.array())

const feeValidation = computed(() => {
  try {
    return Fee.array().safeParse(JSON.parse(fees.value))
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
})

const save = () => {
  customGrid.value = {
    id: customGrid.value.id,
    label: label.value,
    fees: Fee.array().parse(JSON.parse(fees.value)),
  }
}
</script>
