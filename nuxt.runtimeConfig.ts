export const runtimeConfig = {
  awattarApiOrigin: 'https://api.awattar.at',
  telegramSender: {
    token: '',
    defaultChatId: '',
    messagePrefix: 'Powerchart Error',
    messageMaxLength: 500,
  },
  public: {
    appTitle: 'Powerchart',
    appOrigin: '',
    disableSurroundingLayout: false,
    excludeFees: [] as string[],
  },
}
