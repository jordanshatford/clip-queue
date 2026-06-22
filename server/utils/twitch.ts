import type { H3Event } from 'h3'

import { ofetch } from 'ofetch'

import type { TwitchToken, TwitchTokenInfo } from '#shared/twitch'
import type { OAuthAuthentication, OAuthUser } from '#shared/utils'

import { TwitchAPI } from '#shared/twitch'

const BASE_URL: string = 'https://id.twitch.tv/oauth2'
const OAUTH = ofetch.create({ baseURL: BASE_URL })

/**
 * OAuth2 client our application uses for interacting with Twitch OAuth and
 * managing the current users details in cookies.
 */
export class TwitchOAuthClient {
  private tokenCookie: ObjectCookie<TwitchToken>
  private stateCookie: Cookie

  public constructor(
    /**
     * The H3Event to associated with the request.
     */
    readonly event: H3Event,
    /**
     * The configuration values. Defaults to Twitch values from our runtime config values.
     */
    private readonly config = useRuntimeConfig().twitch,
  ) {
    this.tokenCookie = new ObjectCookie<TwitchToken>(event, 'twitch_session')
    this.stateCookie = new Cookie(event, 'twitch_state')
  }

  /**
   * Get authentication details for Twitch.
   */
  public get authentication(): OAuthAuthentication {
    const token = this.tokenCookie.get()
    return {
      clientId: this.config.clientId,
      accessToken: token?.access_token ?? '',
    }
  }

  /**
   * Generate an authorization URL for Twitch OAuth with the details for our application.
   * @returns The URL to redirect to for authentication.
   *
   * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
   */
  public generateAuthUrl(): string {
    const state = createRandomString()
    this.stateCookie.set(state, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })
    const url = new URL(`${BASE_URL}/authorize`)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.config.clientId)
    url.searchParams.set('redirect_uri', this.config.redirectUri)
    url.searchParams.set('scope', this.config.scopes.join(' '))
    url.searchParams.set('state', state)
    return url.toString()
  }

  /**
   * Validate the state from the Twitch OAuth callback.
   * @param state - The state from the callback.
   * @throws When the states are not valid or do not match.
   */
  public validateState(state: string | undefined): void {
    const stored = this.stateCookie.get()
    if (!stored || !state || !(state === stored)) {
      throw createError({
        statusCode: 400,
        message: 'Unable to validate state in callback.',
      })
    }
  }

  /**
   * Get the current users token by exchanging the code from Twitch OAuth callback.
   * @param code - The code from Twitch OAuth callback.
   * @returns TwitchToken the Twitch token.
   */
  public async getToken(code: string): Promise<TwitchToken> {
    const token = await OAUTH<TwitchToken>('/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        code,
      }),
    })
    this.tokenCookie.set(token)
    this.stateCookie.delete()
    return token
  }

  /**
   * Get validated token information for the current user.
   * @returns TwitchTokenInfo for the current user access token.
   */
  public async getValidatedTokenInfo(): Promise<TwitchTokenInfo> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No Twitch token available to get token information.',
      })
    }
    return getValidatedTokenInfo(token.access_token)
  }

  /**
   * Get the current users details based on the access token.
   *
   * @returns OAuthUser for the Twitch user.
   */
  public getCurrentUser(): Promise<OAuthUser> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No Kick token available to get token information.',
      })
    }
    return getCurrentUser(this.authentication)
  }

  /**
   * Refresh the current users Twitch OAuth access token using the refresh token.
   *
   * @see https://dev.twitch.tv/docs/authentication/refresh-tokens/
   */
  public async refreshToken(): Promise<TwitchToken> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Twitch session refresh token is not present.',
      })
    }
    const refreshed = await OAUTH<TwitchToken>('/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    })
    this.tokenCookie.set(refreshed)
    return refreshed
  }

  /**
   * Revoke the current users Twitch OAuth access token.
   *
   * @see https://dev.twitch.tv/docs/authentication/revoke-tokens/
   */
  public async revokeToken(): Promise<void> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No Twitch token available to revoke.',
      })
    }
    await OAUTH('/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        token: token.access_token,
      }),
    })
    this.tokenCookie.delete()
  }
}

/**
 * Get token introspection to validate the users token.
 * @param accessToken - The users access token.
 * @returns TwitchTokenInfo if the token is valid.
 *
 * @see https://dev.twitch.tv/docs/authentication/validate-tokens/
 */
const getValidatedTokenInfo = defineCachedFunction(
  async (accessToken: string): Promise<TwitchTokenInfo> => {
    const introspect = await OAUTH<TwitchTokenInfo>('/validate', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const config = useRuntimeConfig()

    if (introspect?.client_id !== config.twitch.clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Twitch session access token is not for this applications client ID.',
      })
    }

    if (!config.twitch.scopes.every((scope) => introspect.scopes?.includes(scope))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Twitch session access token does not have the required scopes.',
      })
    }

    return introspect
  },
  {
    swr: false,
    maxAge: 60,
    getKey: (accessToken) => `twitch:token:${hash(accessToken)}`,
  },
)

/**
 * Get the current user associated with an access token.
 * @param authentication - The authentication details.
 * @returns Details about the user.
 * @throws Error when the fetch request fails or does not return a user.
 */
const getCurrentUser = defineCachedFunction(
  async (authentication: OAuthAuthentication): Promise<OAuthUser> => {
    const api = new TwitchAPI(() => authentication)
    const user = await api.getUser()
    return {
      id: user.id,
      name: user.login,
      profileImageURL: user.profile_image_url,
    }
  },
  {
    swr: false,
    maxAge: 60 * 5,
    getKey: (authentication: OAuthAuthentication) =>
      `twitch:user:${hash(authentication.accessToken)}`,
  },
)
