import type { GenericKickResponse } from '#shared/kick'

/**
 * Cookies used to store PKCE code verifier for validating Kick oath flow.
 */
export const KICK_PKCE_COOKIE = 'kick_pkce'

/**
 * Kick session cookie name.
 */
export const KICK_SESSION_COOKIE = 'kick_session'

/**
 * Base URL for Kick's OAuth endpoints. This is used for both token exchange and token introspection.
 */
export const KICK_OATH_BASE = 'https://id.kick.com/oauth'

/**
 * Response type for Kick token endpoint, which includes the access token, its expiration
 * time, the refresh token, the scope of the token, and the token type.
 */
export type KickTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: 'Bearer'
}

/**
 * Response type for Kick token introspection endpoint, which includes whether the token
 * is active, the client ID associated with the token, the type of token, the scopes granted
 * to the token, and the expiration time of the token.
 */
export type KickTokenIntrospect = GenericKickResponse<{
  active: boolean
  client_id: string
  token_type: 'app' | 'user'
  scope: string
  exp: number
}>
