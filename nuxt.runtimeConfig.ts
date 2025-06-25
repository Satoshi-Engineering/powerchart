export const runtimeConfig = {
  public: {
    app: {
      title: 'Powerchart',
      origin: '',
    },
    privacyPolicyUrl: {
      de: '',
      en: '',
    },
    legalNoticeUrl: {
      de: '',
      en: '',
    },
    githubUrl: 'https://github.com/Satoshi-Engineering/powerchart',
    defaultElectricityTariff: 'epex-spot-at',
    availableGrids: [
      'noFees',
      'styriaDoubleTariff',
    ],
    defaultGrid: 'noFees',
    disableSurroundingLayout: false,
  },
  awattarApiOrigin: 'https://api.awattar.at',
  telegramSender: {
    token: '',
    defaultChatId: '',
    messagePrefix: 'Powerchart Error',
    messageMaxLength: 500,
  },
}
