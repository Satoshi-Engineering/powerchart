import { MockAwattarApi } from '~~/e2e/mocks/MockAwattarApi'
import { MockTelegramApi } from './MockTelegramApi'

export default async () => {
  MockAwattarApi.init(3050)
  MockTelegramApi.init(3060)
}
