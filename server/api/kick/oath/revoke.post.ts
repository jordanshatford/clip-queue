/**
 * Revoke a Kick.com oath access token or refresh token.
 * @see https://docs.kick.com/getting-started/generating-tokens-oauth2-flow#revoke-token-endpoint
 */
export default defineEventHandler(async (event) => {
  const token = getObjectCookie<KickTokenResponse>(event, KICK_SESSION_COOKIE)

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No Kick tokens available to revoke.',
    })
  }

  await $fetch(`${KICK_OATH_BASE}/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      token: token.access_token,
    }),
  })

  deleteCookie(event, KICK_SESSION_COOKIE)

  return {
    success: true,
  }
})
