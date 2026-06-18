import { FetchError } from 'ofetch'

import type { OAuthAuthentication, OAuthResponse, OAuthUser } from '#shared/utils'

import { TwitchAPI } from '#shared/twitch'

/**
 * Validate the current Twitch.tv session by introspecting the access token. If the token is inactive but a refresh token is
 * available, it will attempt to refresh the session and update the cookie.
 * @see https://dev.twitch.tv/docs/authentication/validate-tokens/
 * @see https://dev.twitch.tv/docs/authentication/refresh-tokens/
 * @see https://dev.twitch.tv/docs/api/reference#get-users
 */
export default defineEventHandler(async (event): Promise<OAuthResponse> => {
  const config = useRuntimeConfig()
  let session = getObjectCookie<TwitchTokenResponse>(event, TWITCH_SESSION_COOKIE)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Twitch session not present to validate.',
    })
  }

  try {
    // Attempt to validate the existing token for the session.
    await getValidatedIntrospection(session.access_token)
  } catch (error) {
    // If the error isn't a 401, it's a network/server issue. Bubble it up.
    if (!(error instanceof FetchError) || error.statusCode !== 401) {
      throw error
    }
    // If Twitch is telling us the token is not valid, attempt to refresh the token
    // and update the user session based on the new values.
    const refreshed = await getRefreshedSession(session.refresh_token)
    setObjectCookie<TwitchTokenResponse>(event, TWITCH_SESSION_COOKIE, refreshed)
    session = refreshed
  }

  const user = await getCurrentUser(session.access_token)
  const authentication: OAuthAuthentication = {
    clientId: config.twitch.clientId,
    accessToken: session.access_token,
  }

  return {
    user,
    authentication,
  }
})

/**
 * Get token introspection to validate the users token.
 * @param accessToken - The users access token.
 * @returns TwitchTokenIntrospect from the Twitch API if the token is valid.
 */
const getValidatedIntrospection = defineCachedFunction(
  async (accessToken: string): Promise<TwitchTokenIntrospect> => {
    const introspect = await $fetch<TwitchTokenIntrospect>(`${TWITCH_OAUTH_BASE}/validate`, {
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
    getKey: (accessToken) => `twitch:introspect:${accessToken}`,
  },
)

/**
 * Get refreshed access token from Twitch.
 * @param refreshToken - The users refresh token.
 * @returns TwitchTokenResponse from the Twitch API if the token was refreshed.
 */
async function getRefreshedSession(refreshToken: string): Promise<TwitchTokenResponse> {
  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Twitch session refresh token is not present.',
    })
  }
  const config = useRuntimeConfig()
  const refreshed = await $fetch<TwitchTokenResponse>(`${TWITCH_OAUTH_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.twitch.clientId,
      client_secret: config.twitch.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  return refreshed
}

/**
 * Get the current user associated with an access token.
 * @param accessToken - The access token.
 * @returns Details about the user.
 * @throws Error when the fetch request fails or does not return a user.
 */
const getCurrentUser = defineCachedFunction(
  async (accessToken: string): Promise<OAuthUser> => {
    const config = useRuntimeConfig()
    const api = new TwitchAPI(() => ({ clientId: config.twitch.clientId, accessToken }))
    const user = await api.getUser()
    return {
      id: user.id,
      name: user.login,
      profileImageURL: user.profile_image_url,
    }
  },
  {
    maxAge: 60 * 5,
    getKey: (accessToken: string) => `twitch:user:${accessToken}`,
  },
)
