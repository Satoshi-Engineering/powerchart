import { DateTime } from 'luxon'

export default () => {
  const today = ref<string>(DateTime.now().toISODate())
  const currentHour = ref(DateTime.now().toFormat('H'))

  let interval: ReturnType<typeof setInterval> | undefined
  onBeforeMount(() => {
    setInterval(() => {
      today.value = DateTime.now().toISODate()
      currentHour.value = DateTime.now().toFormat('H')
    }, 1_000)
  })
  onBeforeUnmount(() => {
    clearInterval(interval)
  })

  return { today, currentHour }
}
