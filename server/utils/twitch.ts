/**
 * Cookies used to store state for validating Twitch oath flow.
 */
export const TWITCH_STATE_COOKIE = 'twitch_state'

/**
 * Twitch session cookie name.
 */
export const TWITCH_SESSION_COOKIE = 'twitch_session'

/**
 * Base URL for Twitch's OAuth endpoints. This is used for both token exchange and token introspection.
 */
export const TWITCH_OAUTH_BASE = 'https://id.twitch.tv/oauth2'

/**
 * Response type for Twitch token endpoint, which includes the access token, its expiration
 * time, the refresh token, the scope of the token, and the token type.
 */
export type TwitchTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  scopes: string[]
  token_type: 'bearer'
}

/**
 * Response type for Twitch token introspection endpoint, which includes whether the token
 * is active, the client ID associated with the token, the type of token, the scopes granted
 * to the token, and the expiration time of the token.
 */
export type TwitchTokenIntrospect = {
  client_id: string
  login: string
  scopes: string[]
  user_id: string
  expires_in: number
}
