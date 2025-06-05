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
})
