import { vi } from 'vitest'
import { mockOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { StreamableProvider } from '~/integrations/misc/streamable'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockOEmbed,
})
const provider = new StreamableProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `${clip.embedUrl}?autoplay=1`,
    title: clip.title,
  }),
})
