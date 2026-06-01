export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery<{
    code?: string
    state?: string
    error?: string
    error_description?: string
  }>(event)

  /**
   * Handle case where Twitch has redirected back to the application with an error, such as when
   * the user denies the authorization request. Validate the state and return an error to the user.
   */
  if (query.error) {
    const state = getCookie(event, TWITCH_STATE_COOKIE)
    if (!state || !query.state || !(query.state === state)) {
      throw createError({
        statusCode: 400,
        message: 'Unable to get state to validate code.',
      })
    }

    throw createError({
      statusCode: 400,
      statusText: 'Twitch OAuth Error',
      message: query.error_description,
    })
  }

  /**
   * When the code is not present, assume that the user has initiated the oauth flow and redirect
   * then to the Twitch oath server.
   * @see https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
   */
  if (!query.code) {
    const state = createRandomString()
    setCookie(event, TWITCH_STATE_COOKIE, state, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    const url = new URL(`${TWITCH_OAUTH_BASE}/authorize`)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', config.twitch.clientId)
    url.searchParams.set('redirect_uri', config.twitch.redirectUri)
    url.searchParams.set('scope', config.twitch.scopes.join(' '))
    url.searchParams.set('state', state)
    return sendRedirect(event, url.toString())
  }

  /**
   * The oath server has called the endpoint with a code for the user. Verify the callback and
   * store a cookie for the users session.
   */
  const state = getCookie(event, TWITCH_STATE_COOKIE)

  if (!state || !query.state || !(query.state === state)) {
    throw createError({
      statusCode: 400,
      message: 'Unable to get state to validate code.',
    })
  }

  try {
    const token = await $fetch<TwitchTokenResponse>(`${TWITCH_OAUTH_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.twitch.clientId,
        client_secret: config.twitch.clientSecret,
        redirect_uri: config.twitch.redirectUri,
        code: query.code,
      }),
    })

    deleteCookie(event, TWITCH_STATE_COOKIE)
    setObjectCookie(event, TWITCH_SESSION_COOKIE, token)

    return sendRedirect(event, '/queue')
  } catch (error) {
    deleteCookie(event, TWITCH_STATE_COOKIE)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : String(error),
    })
  }
})
