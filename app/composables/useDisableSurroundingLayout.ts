export default () => {
  const runtimeConfig = useRuntimeConfig()
  const { updateQueryParam, removeQueryParam, isQueryParamTruthy } = useQueryParameter('disableSurroundingLayout')

  const disableSurroundingLayout = (disable: boolean) => {
    if (disable) {
      updateQueryParam('true')
    } else {
      removeQueryParam()
    }
  }

  const disabledByRoute = computed(() => isQueryParamTruthy())

  const disabledByRuntimeConfig = computed(() => runtimeConfig.public.disableSurroundingLayout)

  const surroundingLayoutDisabled = computed(() => disabledByRoute.value || disabledByRuntimeConfig.value)

  return {
    surroundingLayoutDisabled,
    disableSurroundingLayout,
    surroundingLayoutDisabledByRuntimeConfig: disabledByRuntimeConfig,
  }
}
