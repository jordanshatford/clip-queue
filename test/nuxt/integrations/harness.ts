import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Integration, IntegrationAuthentication, PlayerConfig } from '~/integrations/core'

import { IntegrationID, type Clip, type IntegrationProvider } from '~/integrations'

/**
 * Create a test harness for a given authentication. Shared handling of tests to reduce duplication
 * and ensure that all authentications are tested equally.
 * @param authentication - The authentication to test.
 * @param options - The options to test with.
 */
function createAuthenticationTestHarness(
  authentication: IntegrationAuthentication,
  options: { id: IntegrationID },
): void {
  describe(authentication.id, () => {
    const $fetchMock = vi.fn()
    vi.stubGlobal('$fetch', $fetchMock)

    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('constructs with correct integration config', () => {
      expect(authentication.id).toBe(options.id)
    })

    it('constructs with default values', () => {
      expect(authentication.isLoggedIn).toEqual(false)
      expect(authentication.user).toEqual({ id: '', name: '', profileImageURL: '' })
      expect(authentication.details).toEqual({ clientId: '', accessToken: '' })
    })

    it('updates the authentication state using autologin when a valid session exists', async () => {
      $fetchMock.mockResolvedValueOnce({
        user: {
          id: '123',
          name: 'Test User',
          profileImageURL: 'https://example.com/avatar.png',
        },
        authentication: {
          clientId: 'client-id',
          accessToken: 'access-token',
        },
      })

      await authentication.autoLogin()
      expect(authentication.isLoggedIn).toBe(true)
      expect(authentication.user).toEqual({
        id: '123',
        name: 'Test User',
        profileImageURL: 'https://example.com/avatar.png',
      })
      expect(authentication.details).toEqual({
        clientId: 'client-id',
        accessToken: 'access-token',
      })
    })

    it('throws an error using autologin when no valid session exists', async () => {
      $fetchMock.mockResolvedValueOnce(null)
      await expect(authentication.autoLogin()).rejects.toThrow(
        `[${options.id}]: No valid session found.`,
      )
    })

    // it('redirects to the integration login page', async () => {
    //   await authentication.login()
    //   expect(navigateTo).toHaveBeenCalledTimes(1)
    // })

    it('clears authentication and user state when using logout', async () => {
      $fetchMock
        .mockResolvedValueOnce({
          user: {
            id: '123',
            name: 'Test User',
            profileImageURL: 'https://example.com/avatar.png',
          },
          authentication: {
            clientId: 'client-id',
            accessToken: 'access-token',
          },
        })
        .mockResolvedValueOnce(undefined)

      await authentication.autoLogin()
      expect(authentication.isLoggedIn).toBe(true)
      await authentication.logout()
      expect(authentication.isLoggedIn).toBe(false)
      expect(authentication.user).toEqual({
        id: '',
        name: '',
        profileImageURL: '',
      })
      expect(authentication.details).toEqual({
        clientId: '',
        accessToken: '',
      })
    })
  })
}

/**
 * ID used for testing.
 */
const TEST_ID: string = 'test'

/**
 * URLs that are completely unsupported by the application.
 */
const UNSUPPORTED_URLS: string[] = ['', 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL']

/**
 * URLs formats supported by each provider.
 */
const PROVIDER_SUPPORTED_URLS: Partial<Record<IntegrationID, string[]>> = {
  [IntegrationID.DAILYMOTION]: [
    `https://www.dailymotion.com/video/${TEST_ID}`,
    `https://dai.ly/${TEST_ID}`,
  ],
  [IntegrationID.KICK_CLIPS]: [
    `https://kick.com/channel?clip=${TEST_ID}`,
    `https://kick.com/channel/clip/${TEST_ID}`,
    `https://kick.com/channel/clips/${TEST_ID}`,
  ],
  [IntegrationID.KICK_VODS]: [
    `https://www.kick.com/channel/videos/${TEST_ID}`,
    `https://www.kick.com/channel/videos/${TEST_ID}?t=123`,
  ],
  [IntegrationID.MEDAL]: [
    `https://medal.tv/clips/${TEST_ID}`,
    `https://medal.tv/games/test-game/clips/${TEST_ID}`,
  ],
  [IntegrationID.RUMBLE_SHORTS]: [`https://www.rumble.com/shorts/${TEST_ID}`],
  [IntegrationID.RUMBLE_VIDEOS]: [
    `https://rumble.com/embed/${TEST_ID}`,
    `https://rumble.com/embed/${TEST_ID}?start=123`,
    `https://rumble.com/${TEST_ID}.html`,
    `https://rumble.com/${TEST_ID}.html?start=123`,
  ],
  [IntegrationID.SOOP]: [
    `https://vod.sooplive.com/player/${TEST_ID}`,
    `https://vod.sooplive.com/player/${TEST_ID}?change_second=123`,
  ],
  [IntegrationID.STREAMABLE]: [`https://streamable.com/${TEST_ID}`],
  [IntegrationID.TWITCH_CLIPS]: [
    `https://www.twitch.tv/channel/clip/${TEST_ID}`,
    `https://m.twitch.tv/clip/${TEST_ID}`,
    `https://clips.twitch.tv/${TEST_ID}`,
  ],
  [IntegrationID.TWITCH_VODS]: [
    `http://www.twitch.tv/channel/v/${TEST_ID}`,
    `http://www.twitch.tv/channel/v/${TEST_ID}?t=5m10s`,
    `http://www.twitch.tv/channel/video/${TEST_ID}`,
    `http://www.twitch.tv/channel/video/${TEST_ID}?t=5m10s`,
    `https://www.twitch.tv/videos/${TEST_ID}`,
  ],
  [IntegrationID.VIMEO]: [
    `https://vimeo.com/${TEST_ID}`,
    `https://vimeo.com/${TEST_ID}#t=1m21s`,
    `https://vimeo.com/${TEST_ID}#t=1m0s&end=2m1s`,
  ],
  [IntegrationID.YOUTUBE_SHORTS]: [`https://www.youtube.com/shorts/${TEST_ID}`],
  [IntegrationID.YOUTUBE_VIDEOS]: [
    `https://www.youtube.com/watch?v=${TEST_ID}`,
    `https://www.youtube.com/watch?v=${TEST_ID}&t=123`,
    `https://youtu.be/${TEST_ID}`,
    `https://youtu.be/${TEST_ID}?t=123`,
  ],
}

/**
 * URLs for a provider that are not supported by our integration provider. For example, a
 * video URL that does not contain an ID value.
 */
const PROVIDER_UNSUPPORTED_URLS: Partial<Record<IntegrationID, string[]>> = {
  [IntegrationID.DAILYMOTION]: ['https://www.dailymotion.com/video', 'https://dai.ly'],
  [IntegrationID.KICK_CLIPS]: [
    'https://kick.com/channel',
    'https://kick.com/channel/clip/',
    'https://kick.com/channel/clips/',
  ],
  [IntegrationID.KICK_VODS]: ['https://www.kick.com/channel/videos/'],
  [IntegrationID.MEDAL]: ['https://medal.tv/clips/', 'https://medal.tv/games/test-game/clips/'],
  [IntegrationID.RUMBLE_SHORTS]: ['https://www.rumble.com/shorts/'],
  [IntegrationID.RUMBLE_VIDEOS]: ['https://rumble.com/embed/', 'https://rumble.com/'],
  [IntegrationID.SOOP]: ['https://vod.sooplive.com/player/'],
  [IntegrationID.STREAMABLE]: [`https://streamable.com/`],
  [IntegrationID.TWITCH_CLIPS]: [
    'https://m.twitch.tv/clip/',
    'https://clips.twitch.tv/',
    'https://www.twitch.tv/channel/clip/',
  ],
  [IntegrationID.TWITCH_VODS]: [
    'http://www.twitch.tv/channel/v/',
    'http://www.twitch.tv/channel/video/',
    'https://www.twitch.tv/videos/',
  ],
  [IntegrationID.VIMEO]: ['https://vimeo.com/'],
  [IntegrationID.YOUTUBE_SHORTS]: ['https://www.youtube.com/shorts/'],
  [IntegrationID.YOUTUBE_VIDEOS]: ['https://www.youtube.com/watch', 'https://youtu.be/'],
}

/**
 * Create a list of known supported URLs for a given provider.
 * @param provider - The provider.
 * @returns List of URLs it should support.
 */
export function createSupportedURLs(provider: IntegrationID): string[] {
  return PROVIDER_SUPPORTED_URLS?.[provider] ?? []
}

/**
 * Create a list of known unsupported URLs for a given provider. This includes completely unsupported
 * URLs, URLs that other providers support, and specific URLs for this provider that are in an
 * unsupported format.
 * @param provider - The provider.
 * @returns List of URLs the provider should not support.
 */
export function createUnsupportedURLs(provider: IntegrationID): string[] {
  const { [provider]: _, ...others } = PROVIDER_SUPPORTED_URLS
  const otherProviders = Object.values<string[]>(others).flatMap((v) => v)
  return [...UNSUPPORTED_URLS, ...otherProviders, ...(PROVIDER_UNSUPPORTED_URLS?.[provider] ?? [])]
}

/**
 * Create a test harness for a given provider. Shared handling of tests to reduce duplication
 * and ensure that all providers are tested equally.
 * @param provider - The provider to test.
 * @param options - The options to test with.
 */
export function createProviderTestHarness(
  provider: IntegrationProvider,
  options: {
    isDefaultEnabled: boolean
    toPlayerConfig: (clip: Clip) => PlayerConfig
    tests?: (provider: IntegrationProvider) => void
  },
): void {
  const supportedURLs = createSupportedURLs(provider.id)
  const url = supportedURLs[0] ?? ''
  const unsupportedURLs = createUnsupportedURLs(provider.id)

  describe(provider.name, () => {
    beforeEach(() => {
      vi.clearAllMocks()
      provider.clearCache()
    })

    it('knows its default enabled state', () => {
      expect(provider.isEnabled).toEqual(options.isDefaultEnabled)
    })

    it('can have its enabled state changed', () => {
      provider.isEnabled = true
      expect(provider.isEnabled).toEqual(true)
      provider.isEnabled = false
      expect(provider.isEnabled).toEqual(false)
      provider.isEnabled = true
      expect(provider.isEnabled).toEqual(true)
    })

    it('knows is configured properly', () => {
      expect(provider.isMisconfigured).toEqual(false)
    })

    it(`can get a clip from a ${provider.name} URL`, async () => {
      const clip = await provider.resolveUrl(url)
      expect(clip).toBeDefined()
      expect(clip.id).toEqual(TEST_ID)
    })

    it('has known URLs it can support', () => {
      expect(supportedURLs.length).toBeGreaterThan(0)
    })

    it.each(supportedURLs)('knows it can support URL: %s', async (url: string) => {
      expect(provider.hasSupportForUrl(url)).toEqual(true)
    })

    it('has known URLs it cannot support', () => {
      expect(unsupportedURLs.length).toBeGreaterThan(0)
    })

    it.each(unsupportedURLs)('knows it cannot support URL: %s', async (url: string) => {
      expect(provider.hasSupportForUrl(url)).toEqual(false)
    })

    it.each(unsupportedURLs)(
      'throws an error trying to resolve an unsupported URL: %s',
      async (url: string) => {
        await expect(provider.resolveUrl(url)).rejects.toThrow(`Invalid URL: ${url}.`)
      },
    )

    it('can get the player config for the provider', async () => {
      const clip = await provider.resolveUrl(url)
      expect(clip).toBeDefined()
      expect(provider.getPlayerConfigForClip(clip)).toEqual(options.toPlayerConfig(clip))
    })

    it('caches clip data that it fetches to prevent needing to refetch', async () => {
      expect(provider.hasCachedData).toEqual(false)
      expect(await provider.resolveUrl(url)).toBeDefined()
      expect(provider.hasCachedData).toEqual(true)
      expect(await provider.resolveUrl(url)).toBeDefined()
    })

    it('can have the data its caches cleared', async () => {
      expect(provider.hasCachedData).toEqual(false)
      expect(await provider.resolveUrl(url)).toBeDefined()
      expect(provider.hasCachedData).toEqual(true)
      provider.clearCache()
      expect(provider.hasCachedData).toEqual(false)
    })

    options.tests?.(provider)
  })
}

/**
 * Create a test harness for a given integration. Shared handling of tests to reduce duplication
 * and ensure that all integrations are tested equally.
 * @param integration - The integration to test.
 * @param options - The options to test with.
 */
export function createIntegrationTestHarness(
  integration: Integration,
  options: {
    isExperimental?: boolean
    details: {
      id: IntegrationID
      name: string
      url: string
      icon: string
      primary: string
      secondary?: string
    }
    authentication?: IntegrationID
    source?: IntegrationID
    providers: IntegrationID[]
  },
): void {
  describe(integration.name, () => {
    it('has the expected values defined', () => {
      expect(integration).toBeDefined()
      expect(integration.id).toBe(options.details.id)
      expect(integration.name).toBe(options.details.name)
      expect(integration.url).toBe(options.details.url)
    })

    it('contains branding details', () => {
      expect(integration.branding.icon).toEqual(options.details.icon)
      expect(integration.branding.primary).toEqual(options.details.primary)
      expect(integration.branding.secondary).toEqual(options.details.secondary)
    })

    it('knows if it is experimental', () => {
      expect(integration.isExperimental).toEqual(options.isExperimental)
    })

    it(`has ${options.authentication} authentication associated with it`, () => {
      if (!options.authentication) {
        expect(integration.authentication).toBeUndefined()
        return
      }

      expect(integration.authentication).toBeDefined()
      expect(integration.authentication?.id).toEqual(options.authentication)
    })

    if (integration.authentication) {
      createAuthenticationTestHarness(integration.authentication, {
        id: options.authentication ?? integration.authentication.id,
      })
    }

    it(`has ${options.source} source associated with it`, () => {
      if (!options.source) {
        expect(integration.source).toBeUndefined()
        return
      }

      expect(integration.source).toBeDefined()
      expect(integration.source?.id).toEqual(options.source)
    })

    it('has some providers associated with it', () => {
      expect(options.providers.length).toBeGreaterThan(0)
    })

    it.each(options.providers)(
      'has the %s provider associated with it',
      (provider: IntegrationID) => {
        expect(integration.providers.some((p) => p.id === provider)).toBe(true)
      },
    )

    it('matches the integration contract shape', () => {
      expect(Object.values(IntegrationID)).toContain(integration.id)
      expect(integration).toMatchObject({
        name: expect.any(String),
        url: expect.any(String),
        branding: {
          icon: expect.any(String),
          primary: expect.any(String),
        },
        providers: expect.any(Array),
      })
    })
  })
}
