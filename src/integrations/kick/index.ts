import { IntegrationID, type Integration } from '../common'
import { default as k } from './core'
import { KickProvider } from './providers'

export * from './core/types'

export const clips = new KickProvider()

export const kick: Integration = {
  id: IntegrationID.KICK,
  name: 'Kick',
  icon: k.logo,
  isExperimental: false,
  providers: [clips],
}
