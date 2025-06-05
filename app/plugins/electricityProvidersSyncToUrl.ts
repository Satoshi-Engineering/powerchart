import { CustomTariff } from '~/assets/electricityTariffs'

export default defineNuxtPlugin(() => {
  const electricityProviders = useElectricityProviders()

  watch(() => electricityProviders.selectedTariff, (newTariff) => {
    const config = useRuntimeConfig()
    const defaultTariff = config.public.defaultElectricityTariff
    const selectedTariff = (newTariff === defaultTariff) ? undefined : newTariff

    const route = useRoute()
    const router = useRouter()
    router.replace({
      query: {
        ...route.query,
        selectedTariff,
      },
    })
  })

  watch(() => electricityProviders.customTariff, (newTariff) => {
    const defaultTariff = CustomTariff.parse({})
    const customTariff = (JSON.stringify(newTariff) === JSON.stringify(defaultTariff))
      ? undefined
      : JSON.stringify(newTariff)

    const route = useRoute()
    const router = useRouter()
    router.replace({
      query: {
        ...route.query,
        customTariff,
      },
    })
  }, { deep: true })
})
