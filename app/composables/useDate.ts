import { DateTime } from 'luxon'
import { computed, ref } from 'vue'

export default () => {
  const selectedDate = ref(DateTime.now().startOf('day'))
  const selectedDateIso = computed(() => selectedDate.value.toISODate())
  const selectedDateFormatted = computed(() => selectedDate.value.setLocale('de').toLocaleString(DateTime.DATE_MED))

  return {
    selectedDate,
    selectedDateIso,
    selectedDateFormatted,
  }
}
