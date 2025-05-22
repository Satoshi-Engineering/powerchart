import type { LocationQueryValue } from 'vue-router'

export default (key: string) => {
  const router = useRouter()
  const route = useRoute()

  const updateQueryParam = (value: string | LocationQueryValue[]) => {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        [key]: value,
      },
    })
  }

  const removeQueryParam = () => {
    const { [key]: _, ...newQuery } = route.query
    router.push({
      path: route.path,
      query: newQuery,
    })
  }

  const getQueryParam = () => route.query[key]

  const isQueryParamTruthy = () => {
    const queryParam = route.query[key]
    if (queryParam) {
      return true
    }
    return false
  }

  const value = computed({
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
    removeQueryParam,
    getQueryParam,
    isQueryParamTruthy,
    value,
  }
}
