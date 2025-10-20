import { DateTime } from 'luxon'

const today = ref<string>(DateTime.now().toISODate())
const currentHour = ref(DateTime.now().toFormat('H'))

onNuxtReady(() => {
  setInterval(() => {
    today.value = DateTime.now().toISODate()
    currentHour.value = DateTime.now().toFormat('H')
  }, 60_000)
})

export default () => ({ today, currentHour })
