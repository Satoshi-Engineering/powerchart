import { DateTime } from 'luxon'
import { computed, ref, type Ref, type ComputedRef } from 'vue'

export default (minDate: Ref<DateTime> | ComputedRef<DateTime>, maxDate: Ref<DateTime> | ComputedRef<DateTime>) => {
  const currentDate = ref(DateTime.now().startOf('day'))
  const currentDateIso = computed(() => currentDate.value.toISODate())
  const currentDateFormatted = computed(() => currentDate.value.setLocale('de').toLocaleString(DateTime.DATE_MED))

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
      || date < minDate.value
      || date > maxDate.value
    ) {
      return
    }
    currentDate.value = date
  }

  const prevDateValid = computed(() => currentDate.value.minus({ days: 1 }) >= minDate.value)
  const nextDateValid = computed(() => currentDate.value.plus({ days: 1 }) <= maxDate.value)

  return {
    currentDate,
    currentDateIso,
    currentDateFormatted,
    selectDate,
    selectPrevDate,
    selectNextDate,
    prevDateValid,
    nextDateValid,
  }
}
