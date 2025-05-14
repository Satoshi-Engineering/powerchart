// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

import pkg from './package.json' with { type: 'json' }
import { runtimeConfig } from './nuxt.runtimeConfig.js'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxt/ui-pro',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Powerchart',
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Powerchart' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'apple-touch-icon', href: '/web-app-manifest-192x192.png' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    ...runtimeConfig,
    public: {
      version: pkg.version,
    },
  },
  ignore: ['**/*.test.*', 'e2e/**'],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  typescript: { typeCheck: true },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    lazy: true,
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    locales: [
      {
        code: 'de',
        name: 'Deutsch',
        file: 'de.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
  },
})
