/**
 * Validate the current Twitch.tv session by introspecting the access token. If the token is inactive but a refresh token is
 * available, it will attempt to refresh the session and update the cookie.
 * @see https://dev.twitch.tv/docs/authentication/validate-tokens/
 * @see https://dev.twitch.tv/docs/authentication/refresh-tokens/
 * @see https://dev.twitch.tv/docs/api/reference#get-users
 */
export default defineEventHandler(async (event): Promise<OathResponse> => {
  const config = useRuntimeConfig()
  const session = getObjectCookie<TwitchTokenResponse>(event, TWITCH_SESSION_COOKIE)

  if (!session) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No Twitch session present to validate.',
    })
  }

  let introspect: TwitchTokenIntrospect | undefined
  try {
    introspect = await $fetch<TwitchTokenIntrospect>(`${TWITCH_OAUTH_BASE}/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
  } catch {
    if (!session.refresh_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token is not active and no refresh token is available.',
      })
    }
    const updated = await $fetch<TwitchTokenResponse>(`${TWITCH_OAUTH_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.twitch.clientId,
        client_secret: config.twitch.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: session.refresh_token,
      }),
    })
    setObjectCookie<TwitchTokenResponse>(event, TWITCH_SESSION_COOKIE, updated)
  }

  if (introspect?.client_id !== config.twitch.clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token is not for this applications client ID.',
    })
  }

  if (!config.twitch.scopes.every((scope) => introspect.scopes.includes(scope))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token does not have the required scope.',
    })
  }

  const response = await $fetch<TwitchUsersResponse>(`${TWITCH_PUBLIC_API_BASE}/users`, {
    headers: {
      'Client-ID': config.twitch.clientId,
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
      id: user.id,
      name: user.login,
      profileImageURL: user.profile_image_url,
    },
    authentication: {
      clientId: config.twitch.clientId,
      accessToken: session.access_token,
    },
  }
})
