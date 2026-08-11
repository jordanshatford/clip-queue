/**
 * Revoke the current users Google OAuth access token.
 */
export default defineEventHandler(async (event) => {
  const client = new GoogleOAuth2Client(event)
  await client.revokeToken()
  return {
    success: true,
  }
})
