import { defineEventHandler } from 'nuxt/server'

/**
 * Revoke the current users Kick OAuth access token.
 */
export default defineEventHandler(async (event) => {
  const client = new KickOAuthClient(event)
  await client.revokeToken()
  return {
    success: true,
  }
})
