export default () => {
  const config = useRuntimeConfig()

  const addVatDefaultValue = config.public.defaultAddVat ? 'true' : 'false'
  const addVatQueryParameter = useQueryParameterSetting('addVat', addVatDefaultValue)
  const addVat = computed<boolean, boolean>({
    get() {
      return addVatQueryParameter.value === 'true'
    },
    set(addVat: boolean) {
      if (addVat) {
        addVatQueryParameter.value = 'true'
      } else {
        addVatQueryParameter.value = 'false'
      }
    },
  })

  return {
    addVat,
  }
}
