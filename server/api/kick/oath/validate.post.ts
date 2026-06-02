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
      statusCode: 400,
      statusMessage: 'No Kick session present to validate.',
    })
  }

  const introspect = await $fetch<KickTokenIntrospect>(`${KICK_OATH_BASE}/token/introspect`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  if (introspect.data?.client_id !== config.kick.clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is not for this applications client ID.',
    })
  }

  if (introspect.data?.token_type !== 'user') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is not the valid token type.',
    })
  }

  const scopes = introspect.data?.scope.split(' ')
  if (!config.kick.scopes.every((scope) => scopes.includes(scope))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token does not have the required scope.',
    })
  }

  if (!introspect.data?.active) {
    if (!session.refresh_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is not active and no refresh token is available.',
      })
    }
    const updated = await $fetch<KickTokenResponse>(`${KICK_OATH_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.kick.clientId,
        client_secret: config.kick.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: session.refresh_token,
      }),
    })
    session = updated
    setObjectCookie<KickTokenResponse>(event, KICK_SESSION_COOKIE, updated)
  }

  const response = await $fetch<KickUsersResponse>(`${KICK_PUBLIC_API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })

  const user = response.data?.[0]
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch user with provided token.',
    })
  }
  return {
    user: {
      id: String(user.user_id),
      name: user.name,
      profileImageURL: user.profile_picture,
    },
    authentication: {
      clientId: config.kick.clientId,
      accessToken: session.access_token,
    },
  }
})
