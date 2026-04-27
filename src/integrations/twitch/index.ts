import { IntegrationID, type Integration } from '../common'
import { TwitchAuthentication } from './authentication'
import { logo } from './core/utils'
import { TwitchProvider } from './providers'

export const authentication = new TwitchAuthentication()
export const clips = new TwitchProvider(() => authentication.token.value)

export const twitch: Integration = {
  id: IntegrationID.TWITCH,
  name: 'Twitch',
  icon: logo,
  isExperimental: false,
  authentication,
  providers: [clips],
}
