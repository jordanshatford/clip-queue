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
 * Base URL for Kick's public API endpoints, which can be used to fetch user information and other public data.
 */
export const KICK_PUBLIC_API_BASE = 'https://api.kick.com/public/v1'

/**
 * Generic response type for Kick API responses, where the data field is optional and the
 * message field indicates the status of the response.
 */
export type GenericKickResponse<T> = {
  data?: T
  message: 'OK' | (string & {})
}

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

/**
 * Response type for Kick users endpoint, which includes an array of user objects, where each
 * user object contains the user's ID, name, email, and profile picture URL.
 */
export type KickUsersResponse = GenericKickResponse<
  {
    user_id: number
    name: string
    email: string
    profile_picture: string
  }[]
>
