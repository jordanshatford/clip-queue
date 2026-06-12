import { expect, it, vi } from 'vitest'
import { mockOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { VimeoProvider } from '~/integrations/misc/vimeo'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockOEmbed,
})
const provider = new VimeoProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?autoplay=1&muted=0`,
    title: clip.title,
  }),
  tests: (provider) => {
    it('gets the player config of the video with a timestamp', async () => {
      const url = 'https://vimeo.com/test#t=1m21s'
      const video = await provider.resolveUrl(url)
      expect(video).toBeDefined()
      expect(provider.getPlayerConfigForClip(video)).toEqual({
        type: 'iframe',
        src: `${video.embedUrl}?autoplay=1&muted=0#t=1m21s`,
        title: video.title,
      })
    })

    it('gets the player config of the video with a timestamp and end', async () => {
      const url = 'https://vimeo.com/test#t=1m21s&end=2m0s'
      const video = await provider.resolveUrl(url)
      expect(video).toBeDefined()
      expect(provider.getPlayerConfigForClip(video)).toEqual({
        type: 'iframe',
        src: `${video.embedUrl}?autoplay=1&muted=0#t=1m21s&end=2m0s`,
        title: video.title,
      })
    })
  },
})
