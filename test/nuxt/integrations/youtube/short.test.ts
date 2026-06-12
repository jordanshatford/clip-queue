import { vi } from 'vitest'
import { mockYouTubeOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { YouTubeShortProvider } from '~/integrations/youtube/short'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockYouTubeOEmbed,
})
const provider = new YouTubeShortProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?autoplay=1`,
    title: clip.title,
  }),
})
