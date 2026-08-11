import type { OAuthResponse } from '#shared/utils'

/**
 * Validate and get the current users details from Google.com. If the token has expired, this will attempt
 * to refresh it.
 */
export default defineEventHandler(async (event): Promise<OAuthResponse> => {
  const client = new GoogleOAuth2Client(event)

  await client.getValidatedTokenInfo()
  const user = await client.getCurrentUser()

  console.log(user)

  return {
    user,
    authentication: client.authentication,
  }
})
