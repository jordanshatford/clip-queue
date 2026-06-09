import { FetchError } from 'ofetch'

import { KickAPI } from '#shared/kick'

/**
 * Validate the current Kick.com session by introspecting the access token. If the token is inactive but a refresh token is
 * available, it will attempt to refresh the session and update the cookie.
 * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#token-introspect-endpoint
 * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#refresh-token-endpoint
 * @see https://docs.kick.com/apis/users#get-public-v1-users
 */
export default defineEventHandler(async (event): Promise<OathResponse> => {
  const config = useRuntimeConfig()
  let session = getObjectCookie<KickTokenResponse>(event, KICK_SESSION_COOKIE)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Kick session not present to validate.',
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
    // If Kick is telling us the token is not valid, attempt to refresh the token
    // and update the user session based on the new values.
    const refreshed = await getRefreshedSession(session.refresh_token)
    setObjectCookie<KickTokenResponse>(event, KICK_SESSION_COOKIE, refreshed)
    session = refreshed
  }

  const user = await getCurrentUser(session.access_token)

  return {
    user,
    authentication: {
      clientId: config.kick.clientId,
      accessToken: session.access_token,
    },
  }
})

/**
 * Get token introspection to validate the users token.
 * @param accessToken - The users access token.
 * @returns KickTokenIntrospect from the Kick API if the token is valid.
 */
const getValidatedIntrospection = defineCachedFunction(
  async (accessToken: string): Promise<KickTokenIntrospect> => {
    const introspect = await $fetch<KickTokenIntrospect>(`${KICK_OATH_BASE}/token/introspect`, {
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
    getKey: (accessToken) => `kick:introspect:${accessToken}`,
  },
)

/**
 * Get refreshed access token from Kick.
 * @param refreshToken - The users refresh token.
 * @returns KickTokenResponse from the Kick API if the token was refreshed.
 */
async function getRefreshedSession(refreshToken: string): Promise<KickTokenResponse> {
  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kick session refresh token is not present.',
    })
  }
  const config = useRuntimeConfig()
  const refreshed = await $fetch<KickTokenResponse>(`${KICK_OATH_BASE}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.kick.clientId,
      client_secret: config.kick.clientSecret,
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
  async (accessToken: string): Promise<OathUser> => {
    const api = new KickAPI(() => accessToken)
    const user = await api.getUser()
    return {
      id: String(user.user_id),
      name: user.name,
      profileImageURL: user.profile_picture,
    }
  },
  {
    maxAge: 60 * 5,
    getKey: (accessToken: string) => `kick:user:${accessToken}`,
  },
)
