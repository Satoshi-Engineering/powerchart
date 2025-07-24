export type UpdateType = 'update' | 'push'

export default (key: string, defaultValue: string, type: UpdateType = 'update') => {
  const {
    getQueryParam,
    removeQueryParam,
    updateQueryParam,
    pushQueryParam,
  } = useQueryParameter(key)

  return computed<string>({
    get() {
      const value = getQueryParam()
      if (value == null) {
        return defaultValue
      }
      return String(value)
    },
    set: (newValue) => {
      if (newValue === defaultValue || newValue == null) {
        removeQueryParam()
      } else if (type === 'update') {
        updateQueryParam(newValue)
      } else {
        pushQueryParam(newValue)
      }
    },
  })
}
