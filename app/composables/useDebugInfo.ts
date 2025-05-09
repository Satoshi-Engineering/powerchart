import { useRoute } from 'vue-router'

export default function useDebugInfo() {
  const route = useRoute()

  const info = (...args: unknown[]) => {
    if (route.query.debug == null) {
      return
    }
    console.info(...args)
  }

  return { info }
}
