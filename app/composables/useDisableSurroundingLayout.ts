export default () => {
  const runtimeConfig = useRuntimeConfig()
  const { pushQueryParam, removeQueryParam, isQueryParamTruthy } = useQueryParameter('disableSurroundingLayout')

  const disableSurroundingLayout = (disable: boolean) => {
    if (disable) {
      pushQueryParam('true')
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
