import type { LocationQueryValue } from 'vue-router'

export default (key: string) => {
  const router = useRouter()
  const route = useRoute()

  const updateQueryParam = (value: string | LocationQueryValue[]): void => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        [key]: value,
      },
    })
  }

  const pushQueryParam = (value: string | LocationQueryValue[]): void => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        [key]: value,
      },
    })
  }

  const removeQueryParam = (): void => {
    const { [key]: _, ...newQuery } = route.query
    router.replace({
      path: route.path,
      query: newQuery,
    })
  }

  const getQueryParam = (): LocationQueryValue | LocationQueryValue[] | undefined => route.query[key]

  const isQueryParamTruthy = (): boolean => !!route.query[key]

  const queryParamValue = computed<LocationQueryValue | LocationQueryValue[] | undefined>({
    get: getQueryParam,
    set: (newValue) => {
      if (newValue) {
        updateQueryParam(newValue)
      } else {
        removeQueryParam()
      }
    },
  })

  return {
    updateQueryParam,
    pushQueryParam,
    removeQueryParam,
    getQueryParam,
    isQueryParamTruthy,
    queryParamValue,
  }
}
