// i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  numberFormats: {
    de: {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    en: {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
  datetimeFormats: {
    de: {
      monthAndDay: {
        month: '2-digit',
        day: '2-digit',
      },
    },
    en: {
      monthAndDay: {
        month: '2-digit',
        day: '2-digit',
      },
    },
  },
}))
