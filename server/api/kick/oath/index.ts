export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery<{ code?: string; state?: string }>(event)

  /**
   * When the code is not present, assume that the user has initiated the oauth flow and redirect
   * then to the Kick oath server.
   * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#authorization-endpoint
   */
  if (!query.code) {
    const pkce = createPkce()
    setObjectCookie(event, KICK_PKCE_COOKIE, pkce, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    const url = new URL(`${KICK_OATH_BASE}/authorize`)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', config.kick.clientId)
    url.searchParams.set('redirect_uri', config.kick.redirectUri)
    url.searchParams.set('scope', config.kick.scopes.join(' '))
    url.searchParams.set('state', pkce.state)
    url.searchParams.set('code_challenge', pkce.challenge)
    url.searchParams.set('code_challenge_method', pkce.method)
    return sendRedirect(event, url.toString())
  }

  /**
   * The oath server has called the endpoint with a code for the user. Verify the callback and
   * store a cookie for the users session.
   * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#authorization-endpoint
   */
  const pkce = getObjectCookie<PKCE>(event, KICK_PKCE_COOKIE)

  if (!pkce || !pkce.verifier) {
    throw createError({
      statusCode: 400,
      message: 'Unable to get verifier to validate code.',
    })
  }

  if (!query.state || !(query.state === pkce.state)) {
    throw createError({
      statusCode: 400,
      message: 'Unable to match state when validating code.',
    })
  }

  try {
    const token = await $fetch<KickTokenResponse>(`${KICK_OATH_BASE}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.kick.clientId,
        client_secret: config.kick.clientSecret,
        redirect_uri: config.kick.redirectUri,
        code: query.code,
        code_verifier: pkce.verifier,
      }),
    })

    deleteCookie(event, KICK_PKCE_COOKIE)
    setObjectCookie(event, KICK_SESSION_COOKIE, token)

    return sendRedirect(event, '/queue')
  } catch (error) {
    deleteCookie(event, KICK_PKCE_COOKIE)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : String(error),
    })
  }
})
