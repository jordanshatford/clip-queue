/**
 * Handle Kick OAuth authorization flow.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery<{ code?: string; state?: string }>(event)

  const client = new KickOAuthClient(event)

  // No code present, assume that the user has initiated the OAuth flow, redirect to Kick OAuth.
  if (!query.code) {
    const url = client.generateAuthUrl()
    return sendRedirect(event, url)
  }

  // Kick OAuth server has called back with a code. Validate and exchange it for our access token.
  client.validateState(query.state)
  await client.getToken(query.code)
  return sendRedirect(event, '/queue')
})
