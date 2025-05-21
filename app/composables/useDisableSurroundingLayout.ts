export default () => {
  const route = useRoute()
  const router = useRouter()
  const runtimeConfig = useRuntimeConfig()

  const updateQueryParam = (key: string, value: string) => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        [key]: value,
      },
    })
  }

  const removeQueryParam = (key: string) => {
    const { [key]: _, ...newQuery } = route.query
    router.push({
      path: route.path,
      query: newQuery,
    })
  }

  const disableSurroundingLayout = (disable: boolean) => {
    if (disable) {
      updateQueryParam('disableSurroundingLayout', 'true')
    } else {
      removeQueryParam('disableSurroundingLayout')
    }
  }

  const disabledByRoute = computed(() => {
    const route = useRoute()
    const layout = route.query.disableSurroundingLayout
    if (typeof layout === 'string' && layout.length > 0) {
      return true
    }
    return false
  })

  const disabledByRuntimeConfig = computed(() => {
    return runtimeConfig.public.disableSurroundingLayout
  })

  const surroundingLayoutDisabled = computed(() => disabledByRoute.value || disabledByRuntimeConfig.value)

  return {
    surroundingLayoutDisabled,
    disableSurroundingLayout,
    surroundingLayoutDisabledByRuntimeConfig: disabledByRuntimeConfig,
  }
}
