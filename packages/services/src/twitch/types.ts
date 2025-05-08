export type { ChatUserstate } from 'tmi.js'

/**
 * Twitch user context.
 */
export interface TwitchUserCtx {
  /**
   * The ID of the user.
   */
  id: string
  /**
   * The token of the user.
   */
  token?: string
  /**
   * The username of the user.
   */
  username?: string
}

/**
 * Twitch ID token.
 */
export interface IDToken {
  aud: string
  azp: string
  exp: string
  iat: string
  iss: string
  sub: string
  /**
   * The preferred username.
   */
  preferred_username: string
}

/**
 * Twitch token info.
 */
export interface TokenInfo {
  /**
   * The client ID.
   */
  client_id: string
  /**
   * When the token expires.
   */
  expires_in: number
  /**
   * The login.
   */
  login: string
  /**
   * The scopes.
   */
  scopes: string[]
  /**
   * The user ID.
   */
  user_id: string
}

/**
 * Twitch authorization info.
 */
export interface AuthInfo {
  /**
   * The access token.
   */
  access_token: string
  /**
   * The ID token.
   */
  id_token: string
  /**
   * The token type.
   */
  token_type: string
  /**
   * The scope.
   */
  scope: string
  /**
   * The decoded ID token.
   */
  decodedIdToken: IDToken
}

/**
 * A Twitch user.
 */
export interface TwitchUser {
  /**
   * The ID of the user.
   */
  id: string
  /**
   * The login of the user.
   */
  login: string
  /**
   * The type of the user.
   */
  type: string
  /**
   * The broadcaster type of the user.
   */
  broadcaster_type: string
  /**
   * The date the user was created.
   */
  created_at: string
  /**
   * The email of the user.
   */
  email: string
  /**
   * The description of the user.
   */
  description: string
  /**
   * The display name of the user.
   */
  display_name: string
  /**
   * The offline image URL of the user.
   */
  offline_image_url: string
  /**
   * The profile image URL of the user.
   */
  profile_image_url: string
  /**
   * The view count of the user.
   */
  view_count: number
}

/**
 * A Twitch game.
 */
export interface TwitchGame {
  /**
   * The box art URL of the game.
   */
  box_art_url: string
  /**
   * The ID of the game.
   */
  id: string
  /**
   * The name of the game.
   */
  name: string
}

/**
 * A Twitch clip.
 */
export interface TwitchClip {
  /**
   * The ID of the clip.
   */
  id: string
  /**
   * The URL of the clip.
   */
  url: string
  /**
   * The embed URL of the clip.
   */
  embed_url: string
  /**
   * The broadcaster ID of the clip.
   */
  broadcaster_id: string
  /**
   * The broadcaster name of the clip.
   */
  broadcaster_name: string
  /**
   * The creator ID of the clip.
   */
  creator_id: string
  /**
   * The creator name of the clip.
   */
  creator_name: string
  /**
   * The video ID of the clip.
   */
  video_id: string
  /**
   * The game ID of the clip.
   */
  game_id: string
  /**
   * The language of the clip.
   */
  language: string
  /**
   * The title of the clip.
   */
  title: string
  /**
   * The view count of the clip.
   */
  view_count: number
  /**
   * The created at time of the clip.
   */
  created_at: string
  /**
   * The thumbnail URL of the clip.
   */
  thumbnail_url: string
  /**
   * The duration of the clip.
   */
  duration: number
}

/**
 * A Twitch pagination object.
 */
export interface TwitchPagination {
  /**
   * The cursor. This will not be present if there are no more pages.
   */
  cursor?: string
}

/**
 * A response from Twitch.
 */
export interface TwitchResponse<T> {
  /**
   * The data.
   */
  data: T
}

/**
 * A paged response from Twitch.
 */
export interface TwitchPagedResponse<T> extends TwitchResponse<T> {
  /**
   * The pagination information.
   */
  pagination: TwitchPagination
}
