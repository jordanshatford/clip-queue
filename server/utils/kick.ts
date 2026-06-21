import type { H3Event } from 'h3'

import { ofetch } from 'ofetch'

import type { KickToken, KickTokenInfo } from '#shared/kick'
import type { OAuthAuthentication, OAuthUser } from '#shared/utils'

import { KickAPI } from '#shared/kick'

import type { PKCE } from './pkce'

const BASE_URL: string = 'https://id.kick.com/oauth'
const OAUTH = ofetch.create({ baseURL: BASE_URL })

/**
 * OAuth2 client our application uses for interacting with Kick OAuth and
 * managing the current users details in cookies.
 */
export class KickOAuthClient {
  private tokenCookie: ObjectCookie<KickToken>
  private pkceCookie: ObjectCookie<PKCE>
  private stateCookie: Cookie

  public constructor(
    /**
     * The H3Event to associated with the request.
     */
    readonly event: H3Event,
    /**
     * The configuration values. Defaults to Kick values from our runtime config values.
     */
    private readonly config = useRuntimeConfig().kick,
  ) {
    this.tokenCookie = new ObjectCookie<KickToken>(event, 'kick_session')
    this.pkceCookie = new ObjectCookie<PKCE>(event, 'kick_pkce')
    this.stateCookie = new Cookie(event, 'kick_state')
  }

  /**
   * Get authentication details for Kick.
   */
  public get authentication(): OAuthAuthentication {
    const token = this.tokenCookie.get()
    return {
      clientId: this.config.clientId,
      accessToken: token?.access_token ?? '',
    }
  }

  /**
   * Generate an authorization URL for Kick OAuth with the details for our application.
   * @returns The URL to redirect to for authentication.
   *
   * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#authorization-endpoint
   */
  public generateAuthUrl(): string {
    const pkce = createPkce()
    this.pkceCookie.set(pkce, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })
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
    url.searchParams.set('code_challenge', pkce.challenge)
    url.searchParams.set('code_challenge_method', pkce.method)
    return url.toString()
  }

  /**
   * Validate the state from the Kick OAuth callback.
   * @param state - The state from the callback.
   * @throws When the states are not valid or do not match.
   */
  public validateState(state: string | undefined): void {
    const stored = this.stateCookie.get()
    if (!stored || !state || !(state === stored)) {
      throw createError({
        statusCode: 400,
        message: 'Unable to validate state in OAuth callback.',
      })
    }
  }

  /**
   * Get the current users token by exchanging the code from Kick OAuth callback.
   * @param code - The code from OAuth callback.
   * @returns KickToken the Kick token.
   */
  public async getToken(code: string): Promise<KickToken> {
    const pkce = this.pkceCookie.get()
    if (!pkce || !pkce.verifier) {
      throw createError({
        statusCode: 400,
        message: 'Unable to get verifier to validate code.',
      })
    }

    const token = await OAUTH<KickToken>('/token', {
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
        code_verifier: pkce.verifier,
      }),
    })
    this.tokenCookie.set(token)
    this.pkceCookie.delete()
    this.stateCookie.delete()
    return token
  }

  /**
   * Get validated token information for the current user.
   * @returns KickTokenInfo for the current user access token.
   */
  public async getValidatedTokenInfo(): Promise<KickTokenInfo> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No Kick token available to get token information.',
      })
    }
    return getValidatedTokenInfo(token.access_token)
  }

  /**
   * Get the current users details based on the access token.
   *
   * @returns OAuthUser for the Kick user.
   */
  public getCurrentUser(): Promise<OAuthUser> {
    const token = this.tokenCookie.get()
    if (!token?.access_token) {
      throw createError({
        statusCode: 401,
        message: 'No Kick token available to get token information.',
      })
    }
    return getCurrentUser(this.authentication)
  }

  /**
   * Refresh the current users Kick OAuth access token using the refresh token.
   *
   * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#refresh-token-endpoint
   */
  public async refreshToken(): Promise<KickToken> {
    const token = this.tokenCookie.get()
    if (!token?.refresh_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kick session refresh token is not present.',
      })
    }
    const refreshed = await OAUTH<KickToken>('/token', {
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
   * Revoke the current users Kick OAuth access token.
   *
   * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#revoke-token-endpoint
   */
  public async revokeToken(): Promise<void> {
    const token = this.tokenCookie.get()
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No Kick token available to revoke.',
      })
    }
    await OAUTH('/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: token.access_token,
      }),
    })
    this.tokenCookie.delete()
  }
}

/**
 * Get token introspection to validate the users token.
 * @param accessToken - The users access token.
 * @returns KickTokenInfo if the token is valid.
 *
 * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#token-introspect-endpoint
 */
const getValidatedTokenInfo = defineCachedFunction(
  async (accessToken: string): Promise<KickTokenInfo> => {
    const introspect = await OAUTH<KickTokenInfo>('/token/introspect', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const config = useRuntimeConfig()

    if (introspect.data?.client_id !== config.kick.clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kick session access token is not for this applications client ID.',
      })
    }

    if (introspect.data?.token_type !== 'user') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kick session access token does not have the required type.',
      })
    }

    const scopes = introspect.data?.scope?.split(' ') ?? []
    if (!config.kick.scopes.every((scope) => scopes.includes(scope))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kick session access token does not have the required scopes.',
      })
    }

    if (!introspect.data?.active) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Kick session access token is no longer active.',
      })
    }

    return introspect
  },
  {
    swr: false,
    maxAge: 60,
    getKey: (accessToken) => `kick:token:${hash(accessToken)}`,
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
    const api = new KickAPI(() => authentication)
    const user = await api.getUser()
    return {
      id: String(user.user_id),
      name: user.name,
      profileImageURL: user.profile_picture,
    }
  },
  {
    maxAge: 60 * 5,
    getKey: (authentication: OAuthAuthentication) =>
      `kick:user:${hash(authentication.accessToken)}`,
  },
)
