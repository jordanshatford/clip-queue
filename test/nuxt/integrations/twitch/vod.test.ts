import { expect, it, vi } from 'vitest'
import { mockTwitchVod } from '~~/test/unit/twitch/mocks'

import { TwitchAPI, type TwitchVideo } from '#shared/twitch'
import { TwitchVodProvider } from '~/integrations/twitch/vod'

import { createProviderTestHarness } from '../harness'

const api = new TwitchAPI(() => ({ clientId: '', accessToken: '' }))
api.getVideo = vi.fn<(id: string) => Promise<TwitchVideo>>(async (id) => ({
  ...mockTwitchVod,
  id,
}))
const provider = new TwitchVodProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}&parent=${window.location.hostname}&autoplay=true&muted=false`,
    title: clip.title,
  }),
  tests: (provider) => {
    it('gets the player config of the vod with a timestamp', async () => {
      const time = '1h20m5s'
      const url = `${mockTwitchVod.url}?t=${time}`
      const clip = await provider.resolveUrl(url)
      expect(clip).toBeDefined()
      expect(provider.getPlayerConfigForClip(clip)).toEqual({
        type: 'iframe',
        src: `${clip.embedUrl}&parent=${window.location.hostname}&autoplay=true&muted=false&time=${time}`,
        title: clip.title,
      })
    })
  },
})
