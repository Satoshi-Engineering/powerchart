export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const defaultGrid = config.public.defaultGrid

  const { selectedGrid } = storeToRefs(useGridFees())

  watch(selectedGrid, (newGrid) => {
    const selectedGrid = (newGrid === defaultGrid) ? undefined : newGrid

    const route = useRoute()
    const router = useRouter()
    router.replace({
      query: {
        ...route.query,
        selectedGrid,
      },
    })
  })
})
