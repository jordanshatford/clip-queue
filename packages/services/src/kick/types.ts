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
