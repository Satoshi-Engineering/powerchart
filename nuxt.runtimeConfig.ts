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
    disableSurroundingLayout: false,
    excludeFees: ['infrastructureFee'],
  },
  awattarApiOrigin: 'https://api.awattar.at',
  telegramSender: {
    token: '',
    defaultChatId: '',
    messagePrefix: 'Powerchart Error',
    messageMaxLength: 500,
  },
}
