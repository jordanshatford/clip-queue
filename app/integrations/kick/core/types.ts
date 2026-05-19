/**
 * Category on Kick.
 */
export interface KickCategory {
  /**
   * ID of the category.
   */
  id: number
  /**
   * Name of the category.
   */
  name: string
  /**
   * Slug of the category.
   */
  slug: string
  /**
   * Responsive image of the category.
   */
  responsive: string
  /**
   * Banner of the category.
   */
  banner: string
  /**
   * Parent category of the category.
   */
  parent_category: string
}

/**
 * Channel on Kick.
 */
export interface KickChannel {
  /**
   * ID of the channel.
   */
  id: number
  /**
   * Username of the channel.
   */
  username: string
  /**
   * Slug of the channel.
   */
  slug: string
  /**
   * Profile picture of the channel.
   */
  profile_picture: string | null
}

/**
 * Clip on Kick.
 */
export interface KickClip {
  /**
   * ID of the clip.
   *
   * @example clip_01JFJVH6TWB1QW3ZRFN4WKT6NV
   */
  id: string
  /**
   * ID of the livestream.
   */
  livestream_id: string
  /**
   * ID of the category.
   */
  category_id: string
  /**
   * ID of the channel.
   */
  channel_id: number
  /**
   * ID of the user.
   */
  user_id: number
  /**
   * Title of the clip.
   */
  title: string
  /**
   * URL of the clip.
   */
  clip_url: string
  /**
   * URL of the thumbnail.
   */
  thumbnail_url: string
  /**
   * Privacy of the clip.
   */
  privacy: string
  /**
   * Number of likes.
   */
  likes: number
  /**
   * Whether the clip is liked.
   */
  liked: boolean
  /**
   * Number of views.
   */
  views: number
  /**
   * Duration of the clip.
   */
  duration: number
  /**
   * Time the clip started at.
   */
  started_at: string
  /**
   * Time the clip was created at.
   */
  created_at: string
  /**
   * Whether the clip is mature.
   */
  is_mature: boolean
  /**
   * URL of the video.
   */
  video_url: string
  /**
   * Number of views.
   */
  view_count: number
  /**
   * Number of likes.
   */
  likes_count: number
  /**
   * Whether the clip is live.
   */
  is_live: boolean
  /**
   * Category of the clip.
   */
  category: KickCategory
  /**
   * Creator of the clip.
   */
  creator: KickChannel
  /**
   * Channel of the clip.
   */
  channel: KickChannel
}

/**
 * Video on Kick.
 */
export interface KickVideo {
  /**
   * ID of the video.
   */
  id: number
  /**
   * Livestream ID of the video.
   */
  live_stream_id: number
  /**
   * Slug of the video.
   */
  slug: null
  /**
   * Thumb of the video.
   */
  thumb: null
  /**
   * S3 of the video.
   */
  s3: null
  /**
   * Trading platform ID of the video.
   */
  trading_platform_id: null
  /**
   * Created at timestamp of the video.
   */
  created_at: string
  /**
   * Updated at timestamp of the video.
   */
  updated_at: string
  /**
   * UUID of the video.
   */
  uuid: string
  /**
   * Views on the video.
   */
  views: number
  /**
   * Deleted at timestamp of the video.
   */
  deleted_at: null
  /**
   * Source of the video.
   */
  source: string
  /**
   * Livestream the video is of.
   */
  livestream: KickLivestream
}

/**
 * Livestream on Kick.
 */
export interface KickLivestream {
  /**
   * ID of the livestream.
   */
  id: number
  /**
   * Slug of the livestream.
   */
  slug: string
  /**
   * Channel ID of the livestream.
   */
  channel_id: number
  /**
   * Created at timestamp of the livestream.
   */
  created_at: string
  /**
   * Session title of the livestream.
   */
  session_title: string
  /**
   * If the livestream is live.
   */
  is_live: boolean
  /**
   * Risk level ID of the livestream.
   */
  risk_level_id: null
  /**
   * Start time timestamp of the livestream.
   */
  start_time: string
  /**
   * Source of the livestream.
   */
  source: null
  /**
   * Twitch channel of the livestream.
   */
  twitch_channel: null
  /**
   * Duration of the livestream.
   */
  duration: number
  /**
   * Language of the livestream.
   */
  language: string
  /**
   * If the livestream is mature.
   */
  is_mature: boolean
  /**
   * Viewer count of the livestream.
   */
  viewer_count: number
  /**
   * Thumbnail of the livestream.
   */
  thumbnail: string | null
  /**
   * Channel the livestream is on.
   */
  channel: KickVideoChannel
  /**
   * Categories of the livestream.
   */
  categories: KickVideoCategoryElement[]
}

export interface KickVideoChannel {
  /**
   * ID of the channel.
   */
  id: number
  /**
   * User ID of the channel.
   */
  user_id: number
  /**
   * Slug of the channel.
   */
  slug: string
  /**
   * If the channel is banned.
   */
  is_banned: boolean
  /**
   * Playback URL of the channel.
   */
  playback_url: string
  /**
   * Timestamp when the name was updated for the channel.
   */
  name_updated_at: null
  /**
   * If the channel has VODs enabled.
   */
  vod_enabled: boolean
  /**
   * If the channel has subscriptions enabled.
   */
  subscription_enabled: boolean
  /**
   * Followers count of the channel.
   */
  followersCount: number
  /**
   * User the channel is of.
   */
  user: KickVideoUser
  /**
   * If the channel can host other channels.
   */
  can_host: boolean
  /**
   * Verified status of the channel.
   */
  verified: KickVideoVerified
}

/**
 * Category element from Kick.
 */
export interface KickVideoCategoryElement {
  /**
   * The ID of the category element.
   */
  id: number
  /**
   * The category ID of the category element.
   */
  category_id: number
  /**
   * The name of the category element.
   */
  name: string
  /**
   * The slug of the category element.
   */
  slug: string
  /**
   * The tags of the category element.
   */
  tags: string[]
  /**
   * The description of the category element.
   */
  description: null
  /**
   * The timestamp when the category element was deleted.
   */
  deleted_at: null
  /**
   * The viewers of the category element.
   */
  viewers: number
  /**
   * The category.
   */
  category: KickVideoCategory
}

/**
 * Category on Kick.
 */
export interface KickVideoCategory {
  /**
   * The ID of the category.
   */
  id: number
  /**
   * The name of the category.
   */
  name: string
  /**
   * The slug of the category.
   */
  slug: string
  /**
   * The icon of the category.
   */
  icon: string
}

/**
 * User on Kick.
 */
export interface KickVideoUser {
  /**
   * Profile picture of the user.
   */
  profilepic: string
  /**
   * Bio of the user.
   */
  bio: string
  /**
   * Twitter of the user.
   */
  twitter: string
  /**
   * Facebook of the user.
   */
  facebook: string
  /**
   * Instagram of the user.
   */
  instagram: string
  /**
   * YouTube of the user.
   */
  youtube: string
  /**
   * Discord of the user.
   */
  discord: string
  /**
   * TikTok of the user.
   */
  tiktok: string
  /**
   * Username of the user.
   */
  username: string
}

/**
 * Verified status on Kick.
 */
export interface KickVideoVerified {
  /**
   * ID of the verified status.
   */
  id: number
  /**
   * Channel ID of the verified status.
   */
  channel_id: number
  /**
   * Created at timestamp of the verified status.
   */
  created_at: string
  /**
   * Updated at timestamp of the verified status.
   */
  updated_at: string
}
