import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip } from '~~/test/mocks'
import { mockTwitchClip, mockTwitchVod, mockTwitchGame } from '~~/test/unit/twitch/mocks'

import type { Clip } from '~/integrations'
import type { KickClip } from '~/integrations/kick'

import { TwitchAPI } from '#shared/twitch'

vi.mock('~/integrations/kick/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/kick/core/api')>()),
    getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
  }
})

vi.spyOn(TwitchAPI.prototype, 'getClip').mockResolvedValue(mockTwitchClip)
vi.spyOn(TwitchAPI.prototype, 'getGame').mockResolvedValue(mockTwitchGame)
vi.spyOn(TwitchAPI.prototype, 'getVideo').mockResolvedValue(mockTwitchVod)

describe('integrations.ts', () => {
  beforeEach(() => {
    localStorage?.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  it.each([
    [mockKickClip.clip_url, mockKickClip.id],
    [mockTwitchClip.url, mockTwitchClip.id],
  ])(
    'returns a clip ID for valid clip url: (url: %s) -> %s',
    async (input: string, expected: string) => {
      const integrations = useIntegrations()
      const clip = await integrations.resolve(input)
      expect(clip).toBeDefined()
      expect(clip?.id).toEqual(expected)
    },
  )

  it.each([
    ['', undefined],
    ['abc', undefined],
    ['https://developer.mozilla.org/en-US/docs/Web/API/URL/URL', undefined],
  ])(
    'returns undefined for invalid clip urls: (url: %s) -> %s',
    async (input: string, expected: Clip | undefined) => {
      const integrations = useIntegrations()
      expect(await integrations.resolve(input)).toEqual(expected)
    },
  )

  it.each([['automod', 1]])(
    'registers command %s for interacting with the providers',
    (id: string, args?: number) => {
      const commands = useCommands()
      useIntegrations()
      const cmd = commands.commands[id]
      expect(cmd).toBeDefined()
      expect(cmd?.id).toEqual(id)
      expect(cmd?.help?.args?.length).toEqual(args)
    },
  )
})
