/**
 * Base OEmbed response.
 *
 * @see https://oembed.com/
 */
interface OEmbedBaseResponse {
  /**
   * The resource type. Valid values, along with value-specific parameters, are described below.
   */
  type: 'photo' | 'video' | 'link' | 'rich'
  /**
   * The oEmbed version number. This must be 1.0.
   */
  version: string
  /**
   * A text title, describing the resource.
   */
  title?: string
  /**
   * The name of the author/owner of the resource.
   */
  author_name?: string
  /**
   * A URL for the author/owner of the resource.
   */
  author_url?: string
  /**
   * The name of the resource provider.
   */
  provider_name?: string
  /**
   * The url of the resource provider.
   */
  provider_url?: string
  /**
   * The suggested cache lifetime for this resource, in seconds.
   * Consumers may choose to use this value or not.
   */
  cache_age?: number
  /**
   * A URL to a thumbnail image representing the resource. The
   * thumbnail must respect any maxwidth and maxheight parameters.
   * If this parameter is present, thumbnail_width and
   * thumbnail_height must also be present.
   */
  thumbnail_url?: string
  /**
   * The width of the optional thumbnail. If this parameter is
   * present, thumbnail_url and thumbnail_height must also be present.
   */
  thumbnail_width?: number
  /**
   * The height of the optional thumbnail. If this parameter is
   * present, thumbnail_url and thumbnail_width must also be present.
   */
  thumbnail_height?: number
}

/**
 * Photo OEmbed response.
 */
interface OEmbedPhotoResponse extends OEmbedBaseResponse {
  type: 'photo'
  /**
   * The source URL of the image. Consumers should be able to insert
   * this URL into an <img> element. Only HTTP and HTTPS URLs are valid.
   */
  url: string
  /**
   * The width in pixels of the image specified in the url parameter.
   */
  width: number
  /**
   * The height in pixels of the image specified in the url parameter.
   */
  height: number
}

/**
 * Video OEmbed response.
 */
export interface OEmbedVideoResponse extends OEmbedBaseResponse {
  type: 'video'
  /**
   * The HTML required to embed a video player. The HTML should have no
   * padding or margins. Consumers may wish to load the HTML in an
   * off-domain iframe to avoid XSS vulnerabilities.
   */
  html: string
  /**
   * The width in pixels required to display the HTML.
   */
  width: number
  /**
   * The height in pixels required to display the HTML.
   */
  height: number
}

/**
 * Link OEmbed response.
 */
interface OEmbedLinkResponse extends OEmbedBaseResponse {
  type: 'link'
}

/**
 * Rich OEmbed response.
 */
interface OEmbedRichResponse extends OEmbedBaseResponse {
  type: 'rich'
  /**
   * The HTML required to display the resource. The HTML should have no
   * padding or margins. Consumers may wish to load the HTML in an
   * off-domain iframe to avoid XSS vulnerabilities. The markup should
   * be valid XHTML 1.0 Basic.
   */
  html: string
  /**
   * The width in pixels required to display the HTML.
   */
  width: number
  /**
   * The height in pixels required to display the HTML.
   */
  height: number
}

export type OEmbedResponse =
  | OEmbedPhotoResponse
  | OEmbedVideoResponse
  | OEmbedLinkResponse
  | OEmbedRichResponse
