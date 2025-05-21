import { DateTime } from 'luxon'
import { computed, ref } from 'vue'

export default () => {
  const currentDate = ref(DateTime.now().startOf('day'))
  const currentDateIso = computed(() => currentDate.value.toISODate())
  const currentDateFormatted = computed(() => currentDate.value.setLocale('de').toLocaleString(DateTime.DATE_MED))

  return {
    currentDate,
    currentDateIso,
    currentDateFormatted,
  }
}
