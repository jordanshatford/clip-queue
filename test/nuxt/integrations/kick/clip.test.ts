import { vi } from 'vitest'
import { mockKickClip } from '~~/test/unit/kick/mocks'

import { KickAPI, type KickClip } from '#shared/kick'
import { KickClipsProvider } from '~/integrations/kick/clip'

import { createProviderTestHarness } from '../harness'

const api = new KickAPI()
api.getClip = vi.fn<(id: string) => Promise<KickClip>>(async (id) => ({
  ...mockKickClip,
  id,
}))
const provider = new KickClipsProvider(api)

createProviderTestHarness(provider, {
  isDefaultEnabled: true,
  toPlayerConfig: (clip) => ({
    type: 'video',
    src: clip.embedUrl,
    title: clip.title,
    poster: clip.thumbnailUrl,
  }),
})
