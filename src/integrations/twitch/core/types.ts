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
   * The name of the user.
   */
  login: string
  /**
   * The display name of the user.
   */
  display_name: string
  /**
   * The description of the user.
   */
  description: string
  /**
   * The type of the user.
   */
  type: string
  /**
   * The type of the broadcaster.
   */
  broadcaster_type: string
  /**
   * The URL of the profile picture of the user.
   */
  profile_image_url: string
  /**
   * The URL of the offline video placeholder of the user.
   */
  offline_image_url: string
  /**
   * The date when the user was created, i.e. when they registered on Twitch.
   */
  created_at: string
}

/**
 * A Twitch game.
 */
export interface TwitchGame {
  /**
   * The ID of the game.
   */
  id: string
  /**
   * The name of the game.
   */
  name: string
  /**
   * The URL of the box art of the game.
   */
  box_art_url: string
  /**
   * The IGDB ID of the game, or null if the game doesn't have an IGDB ID assigned at Twitch.
   */
  igdb_id?: string
}

/**
 * A Twitch clip.
 */
export interface TwitchClip {
  /**
   * The clip ID.
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
   * The user ID of the broadcaster of the stream where the clip was created.
   */
  broadcaster_id: string
  /**
   * The display name of the broadcaster of the stream where the clip was created.
   */
  broadcaster_name: string
  /**
   * The user ID of the creator of the clip.
   */
  creator_id: string
  /**
   * The display name of the creator of the clip.
   */
  creator_name: string
  /**
   * The ID of the video the clip is taken from.
   */
  video_id: string
  /**
   * The ID of the game that was being played when the clip was created.
   */
  game_id: string
  /**
   * The language of the stream where the clip was created.
   */
  language: string
  /**
   * The title of the clip.
   */
  title: string
  /**
   * The number of views of the clip.
   */
  view_count: number
  /**
   * The date when the clip was created.
   */
  created_at: string
  /**
   *  The URL of the thumbnail of the clip.
   */
  thumbnail_url: string
  /**
   * The duration of the clip in seconds (up to 0.1 precision).
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
  pagination?:
    | string
    | {
        cursor?: string
      }
}
