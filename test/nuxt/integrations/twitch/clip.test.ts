import { vi } from 'vitest'
import { mockTwitchClip, mockTwitchGame } from '~~/test/unit/twitch/mocks'

import { TwitchAPI, type TwitchClip } from '#shared/twitch'
import { TwitchClipProvider } from '~/integrations/twitch/clip'

import { createProviderTestHarness } from '../harness'

const api = new TwitchAPI(() => ({ clientId: 'test', accessToken: 'test' }))
api.getClip = vi.fn<(id: string) => Promise<TwitchClip>>(async (id) => ({
  ...mockTwitchClip,
  id,
}))
api.getGame = vi.fn().mockResolvedValue({
  ...mockTwitchGame,
})
const provider = new TwitchClipProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: true,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?parent=${window.location.hostname}&autoplay=true&muted=false`,
    title: clip.title,
  }),
})
