export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const defaultAddVat = config.public.defaultAddVat

  const { addVat } = storeToRefs(useAddVat())

  watch(addVat, (newAddVat) => {
    const addVat = (newAddVat === defaultAddVat) ? undefined : newAddVat

    const route = useRoute()
    const router = useRouter()
    router.replace({
      query: {
        ...route.query,
        addVat: JSON.stringify(addVat),
      },
    })
  })
})
