<template>
  <div class="flex items-center justify-center gap-2">
    <button
      class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 py-2 px-4 rounded-l disabled:opacity-50"
      :disabled="!prevDateValid || disabled"
      @click="selectPrevDate"
    >
      {{ type === 'xs' ? '<' : $t('components.datepicker.previous') }}
    </button>
    <label class="bg-gray-300 py-2 px-4">
      <input
        type="date"
        class="bg-transparent outline-none"
        :value="currentDateIso"
        :min="(minDate.toISODate() as string)"
        :max="(maxDate.toISODate() as string)"
        :disabled="disabled"
        @change="selectDate"
      >
    </label>
    <button
      class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 py-2 px-4 rounded-r disabled:opacity-50"
      :disabled="!nextDateValid || disabled"
      data-testid="button-next-day"
      @click="selectNextDate"
    >
      {{ type === 'xs' ? '>' : $t('components.datepicker.next') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<'xs' | 'md' | 'lg'>,
    default: undefined,
  },
  minDate: {
    type: Object as PropType<DateTime>,
    default: () => DateTime.now().minus({ years: 100 }).startOf('day'),
  },
  maxDate: {
    type: Object as PropType<DateTime>,
    default: () => DateTime.now().plus({ years: 100 }).startOf('day'),
  },
})

const currentDate = defineModel<DateTime>({
  type: Object as PropType<DateTime>,
  default: () => DateTime.now().startOf('day'),
})

const currentDateIso = computed(() => currentDate.value.toISODate())

const selectDate = (event: Event) => {
  if (event.target == null) {
    return
  }
  const { value } = event.target as HTMLInputElement
  setDate(DateTime.fromISO(value).startOf('day'))
}

const selectPrevDate = () => {
  setDate(currentDate.value.minus({ days: 1 }))
}

const selectNextDate = () => {
  setDate(currentDate.value.plus({ days: 1 }))
}

const setDate = (date: DateTime) => {
  if (
    !date.isValid
    || date < props.minDate
    || date > props.maxDate
  ) {
    return
  }
  currentDate.value = date
}

const prevDateValid = computed(() => currentDate.value.minus({ days: 1 }) >= props.minDate)
const nextDateValid = computed(() => currentDate.value.plus({ days: 1 }) <= props.maxDate)
</script>
