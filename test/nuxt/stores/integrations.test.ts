import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockKickClip, mockTwitchClip, mockTwitchGame } from '~~/test/mocks'

import type { Clip } from '~/integrations'
import type { KickClip } from '~/integrations/kick'
import type { TwitchClip, TwitchGame } from '~/integrations/twitch/core/types'

vi.mock('~/integrations/kick/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/kick/core/api')>()),
    getClip: vi.fn<(id: string) => KickClip>((id: string) => ({ ...mockKickClip, id })),
  }
})

vi.mock('~/integrations/twitch/core/api', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/twitch/core/api')>()),
    getClips: vi.fn<(_cId: string, _token: string, ids: string[]) => TwitchClip[]>(
      (_cId: string, _token: string, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchClip, id }))
      },
    ),
    getGames: vi.fn<(_cId: string, _token: string, ids: string[]) => TwitchGame[]>(
      (_cId: string, _token: string, ids: string[]) => {
        return ids.map((id) => ({ ...mockTwitchGame, id }))
      },
    ),
  }
})

vi.mock('~/integrations/twitch/core/utils', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('~/integrations/twitch/core/utils')>()),
    getClipIdFromUrl: vi.fn<(url: string) => string | undefined>((url: string) => {
      if (!url.includes('twitch')) {
        return
      }
      try {
        const uri = new URL(url)
        const segments = uri.pathname.split('/').filter(Boolean)
        const id = segments.pop()
        return id
      } catch {
        return
      }
    }),
  }
})

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

  it('registers commands for interacting with the providers', () => {
    const commands = useCommands()
    useIntegrations()
    const cmd = commands.commands['enableintegration']
    expect(cmd).toBeDefined()
    expect(cmd?.id).toEqual('enableintegration')
    const cmd2 = commands.commands['disableintegration']
    expect(cmd2).toBeDefined()
    expect(cmd2?.id).toEqual('disableintegration')
    const cmd3 = commands.commands['enableautomod']
    expect(cmd3).toBeDefined()
    expect(cmd3?.id).toEqual('enableautomod')
    const cmd4 = commands.commands['disableautomod']
    expect(cmd4).toBeDefined()
    expect(cmd4?.id).toEqual('disableautomod')
  })
})
