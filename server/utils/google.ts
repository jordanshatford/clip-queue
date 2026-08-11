import type { Credentials, TokenInfo } from 'google-auth-library'
import type { H3Event } from 'h3'
import type { FetchError } from 'ofetch'

import { OAuth2Client } from 'google-auth-library'

// TODO(jordan): use code challenge stuff
// TODO(jordan): Use PKCE for google. Have callback function that takes query in function and throws errors?
// in client. Offline status for YouTube chat.
// TODO(jordan): attempt to verify app so it can have more users.
// TODO(jordan): google oauth validation process. Privacy page, etc. Like fossabot

/**
 * OAuth2 client our application uses for interacting with Google OAuth and
 * managing the users details in cookies.
 */
// TODO(jordan): rename to OAuthClient
export class GoogleOAuth2Client {
  private client: OAuth2Client
  private credentialsCookie: ObjectCookie<Credentials>
  private stateCookie: Cookie

  public constructor(
    /**
     * The H3Event to associated with the request.
     */
    readonly event: H3Event,
    /**
     * The configuration values. Defaults to values from our runtime config values.
     */
    private readonly config = useRuntimeConfig().google,
  ) {
    this.client = new OAuth2Client({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
    })
    // Ensure whenever the credentials are updated we store those updated values in the cookie.
    this.client.on('tokens', (tokens) => {
      this.credentialsCookie.set({
        ...this.client.credentials,
        ...tokens,
      })
    })
    this.credentialsCookie = new ObjectCookie<Credentials>(event, 'google_session')
    this.stateCookie = new Cookie(event, 'google_state')
    // Attempt to set the credentials for our client to the existing cookie values.
    const credentials = this.credentialsCookie.get()
    if (credentials) {
      this.client.setCredentials(credentials)
    }
  }

  /**
   * Get authentication details for Google.
   */
  public get authentication(): OAuthAuthentication {
    const token = this.credentialsCookie.get()
    return {
      clientId: this.config.clientId,
      accessToken: token?.access_token ?? '',
    }
  }

  /**
   * Generate an authorization URL for Google OAuth with the details for our application.
   * @returns The URL to redirect to for authentication.
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

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      include_granted_scopes: true,
      state,
    })
  }

  /**
   * Validate the state from the Google OAuth callback.
   * @param state - The state from the callback.
   * @throws When the states are not valid or do not match.
   */
  public validateState(state: string | undefined): void {
    const stored = this.stateCookie.get()
    if (!stored || !state || !(state === stored)) {
      throw createError({
        statusCode: 400,
        message: 'Unable validate state in callback.',
      })
    }
  }

  /**
   * Get the current users token by exchanging the code from Google OAuth callback.
   * @param code - The code from Google OAuth callback.
   * @returns Credentials the Google token.
   */
  public async getToken(code: string): Promise<Credentials> {
    const { tokens } = await this.client.getToken(code)
    this.credentialsCookie.set(tokens)
    this.stateCookie.delete()
    return tokens
  }

  /**
   * Get validated token information for the current user.
   * @returns TokenInfo for the current user access token.
   */
  public async getValidatedTokenInfo(): Promise<TokenInfo> {
    if (!this.client.credentials.access_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No Google credentials available to get token information.',
      })
    }

    const info = await this.client.getTokenInfo(this.client.credentials.access_token)
    if (!this.config.scopes.every((scope) => info.scopes?.includes(scope))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Google access token does not have the required scopes.',
      })
    }
    return info
  }

  /**
   * Get the current users details based on the access token.
   *
   * @returns OAuthUser for the Twitch user.
   */
  public getCurrentUser(): Promise<OAuthUser> {
    const token = this.credentialsCookie.get()
    if (!token?.access_token) {
      throw createError({
        statusCode: 401,
        message: 'No Google token available to get token information.',
      })
    }
    return getCurrentUser(this.authentication)
  }
  /**
   * Revoke the current users Twitch OAuth access token.
   */
  public async revokeToken(): Promise<void> {
    if (!this.client.credentials.access_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No Google credentials available to revoke.',
      })
    }
    await this.client.revokeCredentials()
    this.credentialsCookie.delete()
  }
}

type GoogleUserInfo = {
  sub: string
  name: string
  given_name: string
  picture: string
}

/**
 * Get the current user associated with an access token.
 * @param authentication - The authentication details.
 * @returns Details about the user.
 * @throws Error when the fetch request fails or does not return a user.
 */
const getCurrentUser = defineCachedFunction(
  async (authentication: OAuthAuthentication): Promise<OAuthUser> => {
    const user = await $fetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${authentication.accessToken}`,
      },
    })

    try {
      const data = await $fetch('https://www.googleapis.com/youtube/v3/liveBroadcasts', {
        query: { part: 'snippet', broadcastStatus: 'active' },
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
      console.log(JSON.stringify(data))
    } catch (e) {
      const error = e as FetchError
      // This will output the exact reason Google rejected the request
      console.log(JSON.stringify(error.data))
      console.error('Google API Error Details:', error.data?.error)
    }
    // const l = await $fetch('https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&mine=true', {
    // // const l = await $fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true', {
    //   headers: {
    //     Authorization: `Bearer ${authentication.accessToken}`,
    //   },
    // })
    // console.log(JSON.stringify(l))
    return {
      id: user.sub,
      name: user.name,
      profileImageURL: user.picture,
    }
  },
  {
    swr: false,
    maxAge: 60 * 5,
    getKey: (authentication: OAuthAuthentication) =>
      `google:user:${hash(authentication.accessToken)}`,
  },
)
