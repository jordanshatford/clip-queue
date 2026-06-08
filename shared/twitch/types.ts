/**
 * A Twitch game.
 */
export interface TwitchGame {
  /**
   * An ID that identifies the category or game.
   */
  id: string
  /**
   * The category’s or game’s name.
   */
  name: string
  /**
   * A URL to the category’s or game’s box art. You must replace the {width}x{height} placeholder with
   * the size of image you want.
   */
  box_art_url: string
  /**
   * The ID that IGDB uses to identify this game. If the IGDB ID is not available to Twitch, this field
   * is set to an empty string.
   */
  igdb_id: string | ''
}

/**
 * A Twitch clip.
 */
export interface TwitchClip {
  /**
   * An ID that uniquely identifies the clip.
   */
  id: string
  /**
   * A URL to the clip.
   */
  url: string
  /**
   * A URL that you can use in an iframe to embed the clip (see Embedding Video and Clips).
   */
  embed_url: string
  /**
   * An ID that identifies the broadcaster that the video was clipped from.
   */
  broadcaster_id: string
  /**
   * The broadcaster’s display name.
   */
  broadcaster_name: string
  /**
   * An ID that identifies the user that created the clip.
   */
  creator_id: string
  /**
   * The user’s display name.
   */
  creator_name: string
  /**
   * An ID that identifies the video that the clip came from. This field contains an empty
   * string if the video is not available.
   */
  video_id: string | ''
  /**
   * The ID of the game that was being played when the clip was created.
   */
  game_id: string
  /**
   * The ISO 639-1 two-letter language code that the broadcaster broadcasts in. For example,
   * en for English. The value is other if the broadcaster uses a language that Twitch
   * doesn’t support.
   */
  language: string
  /**
   * The title of the clip.
   */
  title: string
  /**
   * The number of times the clip has been viewed.
   */
  view_count: number
  /**
   * The date and time of when the clip was created. The date and time is in RFC3339 format.
   */
  created_at: string
  /**
   * A URL to a thumbnail image of the clip.
   */
  thumbnail_url: string
  /**
   * The length of the clip, in seconds. Precision is 0.1.
   */
  duration: number
  /**
   * The zero-based offset, in seconds, to where the clip starts in the video (VOD). Is
   * null if the video is not available or hasn’t been created yet from the live stream
   * (see video_id).
   *
   * Note that there’s a delay between when a clip is created during a broadcast and when
   * the offset is set. During the delay period, vod_offset is null. The delay is
   * indeterminant but is typically minutes long.
   */
  vod_offset: number | null
  /**
   * A Boolean value that indicates if the clip is featured or not.
   */
  is_featured: boolean
}

/**
 * A Twitch video.
 */
export interface TwitchVideo {
  /**
   * An ID that identifies the video.
   */
  id: string
  /**
   * The ID of the stream that the video originated from if the video's type is "archive;"
   * otherwise, null.
   */
  stream_id: string | null
  /**
   * The ID of the broadcaster that owns the video.
   */
  user_id: string
  /**
   * The broadcaster's login name.
   */
  user_login: string
  /**
   * The broadcaster's display name.
   */
  user_name: string
  /**
   * The video's title.
   */
  title: string
  /**
   * The video's description.
   */
  description: string
  /**
   * The date and time, in UTC, of when the video was created. The timestamp is in RFC3339
   * format.
   */
  created_at: string
  /**
   * The date and time, in UTC, of when the video was published. The timestamp is in RFC3339
   * format.
   */
  published_at: string
  /**
   * The video's URL.
   */
  url: string
  /**
   * A URL to a thumbnail image of the video. Before using the URL, you must replace the
   * %{width} and %{height} placeholders with the width and height of the thumbnail you want
   * returned. Due to current limitations, ${width} must be 320 and ${height} must be 180.
   */
  thumbnail_url: string
  /**
   * The video's viewable state. Always set to public.
   */
  viewable: string
  /**
   * The number of times that users have watched the video.
   */
  view_count: number
  /**
   * The ISO 639-1 two-letter language code that the video was broadcast in. For example, the
   * language code is DE if the video was broadcast in German. For a list of supported languages,
   * see Supported Stream Language. The language value is "other" if the video was broadcast in
   * a language not in the list of supported languages.
   */
  language: string
  /**
   * The video's type.
   */
  type: 'archive' | 'highlight' | 'upload'
  /**
   * The video's length in ISO 8601 duration format. For example, 3m21s represents 3 minutes,
   * 21 seconds.
   */
  duration: string
}

/**
 * A Twitch user.
 */
export type TwitchUser = {
  /**
   * An ID that identifies the user.
   */
  id: string
  /**
   * The user’s login name.
   */
  login: string
  /**
   * The user’s display name.
   */
  display_name: string
  /**
   * The type of user.
   */
  type: 'admin' | 'global_mod' | 'staff' | ''
  /**
   * The type of broadcaster.
   */
  broadcaster_type: 'affiliate' | 'partner' | ''
  /**
   * The user’s description of their channel.
   */
  description: string
  /**
   * A URL to the user’s profile image.
   */
  profile_image_url: string
  /**
   * A URL to the user’s offline image.
   */
  offline_image_url: string
  /**
   * The user’s verified email address. The object includes this field only if the user access
   * token includes the user:read:email scope.
   *
   * If the request contains more than one user, only the user associated with the access token
   * that provided consent will include an email address — the email address for all other users
   * will be empty.
   */
  email?: string
  /**
   * The UTC date and time that the user’s account was created. The timestamp is in RFC3339 format.
   */
  created_at: string
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
