import { expect, it, vi } from 'vitest'
import { mockYouTubeOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { YouTubeVideoProvider } from '~/integrations/youtube/video'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockYouTubeOEmbed,
})
const provider = new YouTubeVideoProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?autoplay=1`,
    title: clip.title,
  }),
  tests: (provider) => {
    it('gets the player config of the video with a timestamp', async () => {
      const url = 'https://www.youtube.com/watch?v=id&t=123'
      const clip = await provider.resolveUrl(url)
      expect(clip).toBeDefined()
      expect(provider.getPlayerConfigForClip(clip)).toEqual({
        type: 'iframe',
        src: `${clip.embedUrl}?autoplay=1&start=123`,
        title: clip.title,
      })
    })
  },
})
