import { IntegrationID, type Integration } from '../common'
import { TwitchAuthentication } from './authentication'

export const authentication = new TwitchAuthentication()

export const twitch: Integration = {
  id: IntegrationID.TWITCH,
  name: 'Twitch',
  isExperimental: false,
  authentication,
}
