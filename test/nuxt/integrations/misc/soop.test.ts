import { expect, it, vi } from 'vitest'
import { mockOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { SoopProvider } from '~/integrations/misc/soop'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockOEmbed,
})
const provider = new SoopProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?autoPlay=true`,
    title: clip.title,
  }),
  tests: (provider) => {
    it('gets the player config of the video with a timestamp', async () => {
      const url = 'https://vod.sooplive.com/player/test?change_second=123'
      const video = await provider.resolveUrl(url)
      expect(video).toBeDefined()
      expect(provider.getPlayerConfigForClip(video)).toEqual({
        type: 'iframe',
        src: `${video.embedUrl}?autoPlay=true&change_second=123`,
        title: video.title,
      })
    })
  },
})
