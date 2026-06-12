import { expect, it, vi } from 'vitest'
import { mockKickVod } from '~~/test/unit/kick/mocks'

import { KickAPI, type KickVideo } from '#shared/kick'
import { KickVodProvider } from '~/integrations/kick/vod'

import { createProviderTestHarness } from '../harness'

const api = new KickAPI()
api.getVideo = vi.fn<(id: string) => Promise<KickVideo>>(async (id) => ({
  ...mockKickVod,
  uuid: id,
}))
const provider = new KickVodProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'video',
    src: clip.embedUrl,
    title: clip.title,
    poster: clip.thumbnailUrl,
    start: undefined,
  }),
  tests: (provider) => {
    it('gets the player config of the vod with a timestamp', async () => {
      const url = `https://www.kick.com/channel/videos/${mockKickVod.uuid}?t=1000`
      const video = await provider.resolveUrl(url)
      expect(video).toBeDefined()
      expect(provider.getPlayerConfigForClip(video)).toEqual({
        type: 'video',
        src: video.embedUrl,
        title: video.title,
        poster: video.thumbnailUrl,
        start: 1000,
      })
    })
  },
})
