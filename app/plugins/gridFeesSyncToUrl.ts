import { CustomGridFees } from '~/types/GridFees'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const defaultGrid = config.public.defaultGrid

  const { selectedGrid, customGrid } = storeToRefs(useGridFees())

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

  watch(customGrid, (newGrid) => {
    const defaultGrid = CustomGridFees.parse({})
    const customGrid = (JSON.stringify(newGrid) === JSON.stringify(defaultGrid))
      ? undefined
      : JSON.stringify(newGrid)

    const route = useRoute()
    const router = useRouter()
    router.push({
      query: {
        ...route.query,
        customGrid,
      },
    })
  }, { deep: true })
})
