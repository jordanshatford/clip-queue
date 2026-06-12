import { vi } from 'vitest'
import { mockRumbleOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { RumbleShortProvider } from '~/integrations/rumble/short'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockRumbleOEmbed,
})
const provider = new RumbleShortProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `https://rumble.com/embed/url?autoplay=2`,
    title: clip.title,
  }),
})
