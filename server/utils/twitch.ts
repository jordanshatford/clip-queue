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
 * Base URL for Twitch's public API endpoints, which can be used to fetch user information and other public data.
 */
export const TWITCH_PUBLIC_API_BASE = 'https://api.twitch.tv/helix'

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

/**
 * Generic response type for Twitch API responses, where the data field is optional and the
 * message field indicates the status of the response.
 */
export type GenericTwitchResponse<T> = {
  data?: T
}

/**
 * Response type for Twitch user.
 */
export type TwitchUser = {
  id: string
  login: string
  display_name: string
  type: 'admin' | 'global_mod' | 'staff' | ''
  broadcaster_type: 'affiliate' | 'partner' | ''
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email?: string
  created_at: string
}

/**
 * Response type for Twitch users endpoint. It includes an array of user objects, where each
 * user object contains the user's ID, login, display name, type, broadcaster type, description,
 * profile image URL, offline image URL, view count, email (if available), and account creation date.
 */
export type TwitchUsersResponse = GenericTwitchResponse<TwitchUser[]>
