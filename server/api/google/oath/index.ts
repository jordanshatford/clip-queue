/**
 * Handle Google OAuth authorization flow.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery<{
    code?: string
    state?: string
    error?: string
  }>(event)

  const client = new GoogleOAuth2Client(event)

  // Google OAuth authorization flow has returned an error. Rethrow that error for the user.
  if (query.error) {
    client.validateState(query.state)
    throw createError({
      statusCode: 400,
      statusText: 'Google OAuth Error',
      message: query.error,
    })
  }

  // No code present, assume that the user has initiated the OAuth flow, redirect to Google OAuth.
  if (!query.code) {
    const url = client.generateAuthUrl()
    return sendRedirect(event, url)
  }

  // Google OAuth server has called back with a code. Validate and exchange it for our access token.
  client.validateState(query.state)
  await client.getToken(query.code)
  return sendRedirect(event, '/queue')
})
