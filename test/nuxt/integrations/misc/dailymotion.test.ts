import { vi } from 'vitest'
import { mockOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { DailyMotionProvider } from '~/integrations/misc/dailymotion'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockOEmbed,
})
const provider = new DailyMotionProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}&autoplay=true`,
    title: clip.title,
  }),
})
