export default () => {
  const { n } = useI18n()

  const formatNumber = (
    value: number,
    maximumFractionDigits: number,
    minimumFractionDigits = 0,
    roundUp = false,
    locale: string | undefined = undefined,
  ): string => {
    if (roundUp && countDecimals(value) > maximumFractionDigits) {
      value = Math.ceil(value * Math.pow(10, maximumFractionDigits)) / Math.pow(10, maximumFractionDigits)
    }
    if (locale != null) {
      return value.toLocaleString(locale, { maximumFractionDigits, minimumFractionDigits })
    }
    return n(value, { maximumFractionDigits, minimumFractionDigits })
  }

  const countDecimals = (value: number) => {
    if (Math.floor(value) === value) {
      return 0
    }
    return value.toString().split('.')[1]?.length || 0
  }

  return {
    formatNumber,
  }
}
