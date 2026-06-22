import { FetchError } from 'ofetch'

import type { OAuthResponse } from '#shared/utils'

/**
 * Validate and get the current users details from Kick.com. If the token has expired, this will attempt
 * to refresh it.
 */
export default defineEventHandler(async (event): Promise<OAuthResponse> => {
  const client = new KickOAuthClient(event)

  try {
    await client.getValidatedTokenInfo()
  } catch (error) {
    // If the error isn't a 401, it's a network/server issue. Bubble it up.
    if (!(error instanceof FetchError) || error.statusCode !== 401) {
      throw error
    }
    // If Kick is telling us the token is not valid, attempt to refresh the token
    // and update the user session based on the new values.
    await client.refreshToken()
  }

  const user = await client.getCurrentUser()

  return {
    user,
    authentication: client.authentication,
  }
})
