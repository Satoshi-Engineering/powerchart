export const useAddVat = defineStore('addVat', {
  state: (): {
    addVat: boolean
  } => {
    const config = useRuntimeConfig()
    const route = useRoute()

    let addVat = config.public.defaultAddVat
    if (route.query.addVat === 'true') {
      addVat = true
    } else if (route.query.addVat === 'false') {
      addVat = false
    }

    return {
      addVat,
    }
  },
})
