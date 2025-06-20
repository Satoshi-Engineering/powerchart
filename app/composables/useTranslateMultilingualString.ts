export type MultiLingualString = {
  de?: string
  en?: string
}

export default () => {
  const { locale } = useI18n()
  return (multiLang?: MultiLingualString | string): string | undefined => {
    if (typeof multiLang === 'string') {
      return multiLang
    }
    if (!multiLang) {
      return undefined
    }
    return multiLang[locale.value]
      || multiLang.en
      || multiLang.de
  }
}
