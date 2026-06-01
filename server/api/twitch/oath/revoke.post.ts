/**
 * Revoke a Twitch.tv oath access token or refresh token.
 * @see https://dev.twitch.tv/docs/authentication/revoke-tokens/
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getObjectCookie<TwitchTokenResponse>(event, TWITCH_SESSION_COOKIE)

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No Twitch tokens available to revoke.',
    })
  }

  await $fetch(`${TWITCH_OAUTH_BASE}/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.twitch.clientId,
      token: token.access_token,
    }),
  })

  deleteCookie(event, TWITCH_SESSION_COOKIE)

  return {
    success: true,
  }
})
