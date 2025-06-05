import kebabCase from 'lodash.kebabcase'

import { runtimeConfig } from '~~/nuxt.runtimeConfig.js'

const checkConfig = (rootKey: string, config: object) => {
  Object.entries(config).forEach(([key, value]) => {
    const currentKey = mapKey(rootKey, key)
    if (
      typeof value === 'object'
      && !Array.isArray(value)
    ) {
      checkConfig(currentKey, value)
      return
    }
    if (process.env[currentKey] == null) {
      throw new Error(`Missing environment variable ${currentKey}`)
    }
  })
}

const mapKey = (rootKey: string, key: string) => {
  return `${rootKey}_${kebabCase(key).toUpperCase().replace(/-/g, '_')}`
}

checkConfig('NUXT', runtimeConfig)
