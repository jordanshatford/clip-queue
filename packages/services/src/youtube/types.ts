/**
 * The response item from the YouTube Operational API when looking up a clip.
 */
interface YouTubeClipLookupResponseItem {
  /**
   * The kind of the item.
   */
  kind: string
  /**
   * The etag of the item.
   */
  etag: string
  /**
   * The ID of the item.
   */
  id: string
  /**
   * The video ID of the item.
   */
  videoId: string | null
  /**
   * The clip of the item.
   */
  clip?: {
    /**
     * The title of the clip.
     */
    title: string
    /**
     * The start time of the clip in milliseconds.
     */
    startTimeMs: number
    /**
     * The end time of the clip in milliseconds.
     */
    endTimeMs: number
  }
}

/**
 * The response from the YouTube Operational API when looking up a clip.
 */
export interface YouTubeClipLookupResponse {
  /**
   * The kind of the response.
   */
  kind: string
  /**
   * The etag of the response.
   */
  etag: string
  /**
   * The items of the response.
   */
  items: YouTubeClipLookupResponseItem[]
}

/**
 * The response from the YouTube OEmbed API.
 */
export interface YouTubeOEmbedResponse {
  /**
   * The title of the video.
   */
  title: string
  /**
   * The author name of the video.
   */
  author_name: string
  /**
   * The author URL of the video.
   */
  author_url: string
  /**
   * The type of the video.
   */
  type: string
  /**
   * The height of the video.
   */
  height: number
  /**
   * The width of the video.
   */
  width: number
  /**
   * The version of the video.
   */
  version: string
  /**
   * The provider name of the video.
   */
  provider_name: string
  /**
   * The provider URL of the video.
   */
  provider_url: string
  /**
   * The thumbnail height of the video.
   */
  thumbnail_height: number
  /**
   * The thumbnail width of the video.
   */
  thumbnail_width: number
  /**
   * The thumbnail URL of the video.
   */
  thumbnail_url: string
  /**
   * The HTML of the video.
   */
  html: string
}

/**
 * A YouTube clip.
 */
export interface YouTubeClip {
  /**
   * The ID of the clip.
   */
  id: string
  /**
   * The URL of the clip.
   */
  url: string
  /**
   * The video ID of the clip.
   */
  video_id: string
  /**
   * The video URL of the clip.
   */
  video_url: string
  /**
   * The title of the clip.
   */
  title: string
  /**
   * The author name of the clip.
   */
  author_name: string
  /**
   * The thumbnail URL of the clip.
   */
  thumbnail_url: string
  /**
   * The start time of the clip in seconds.
   */
  start: number
  /**
   * The end time of the clip in seconds.
   */
  end: number
}
