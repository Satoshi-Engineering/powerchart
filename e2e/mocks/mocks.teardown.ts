import { MockAwattarApi } from '~~/e2e/mocks/MockAwattarApi'
import { MockTelegramApi } from './MockTelegramApi'

export default async () => {
  MockAwattarApi.stop()
  MockTelegramApi.stop()
}
