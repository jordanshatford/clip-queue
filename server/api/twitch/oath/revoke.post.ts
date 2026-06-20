/**
 * Revoke the current users Twitch OAuth access token.
 */
export default defineEventHandler(async (event) => {
  const client = new TwitchOAuthClient(event)
  await client.revokeToken()
  return {
    success: true,
  }
})
