import { expect, it, vi } from 'vitest'
import { mockRumbleOEmbed } from '~~/test/unit/oembed/mocks'

import { OEmbedAPI } from '#shared/oembed'
import { RumbleVideoProvider } from '~/integrations/rumble/video'

import { createProviderTestHarness } from '../harness'

const api = new OEmbedAPI()
api.getOEmbed = vi.fn().mockResolvedValue({
  ...mockRumbleOEmbed,
})
const provider = new RumbleVideoProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: false,
  toPlayerConfig: (clip) => ({
    type: 'iframe',
    src: `https://rumble.com/embed/url?autoplay=2`,
    title: clip.title,
  }),
  tests: (provider) => {
    it('gets the player config of the video with a timestamp', async () => {
      const url = 'https://www.rumble.com/test-video.html?start=123'
      const clip = await provider.resolveUrl(url)
      expect(clip).toBeDefined()
      expect(provider.getPlayerConfigForClip(clip)).toEqual({
        type: 'iframe',
        src: `https://rumble.com/embed/url?autoplay=2&start=123`,
        title: clip.title,
      })
    })
  },
})
