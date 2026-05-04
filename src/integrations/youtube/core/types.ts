/**
 * OEmbed response from YouTube OEmbed.
 */
export interface OEmbedResponse {
  /**
   * The title of the OEmbed.
   */
  title: string
  /**
   * The author name of the OEmbed.
   */
  author_name: string
  /**
   * The author URL the OEmbed.
   */
  author_url: string
  /**
   * The type of OEmbed.
   */
  type: string
  /**
   * The height of the OEmbed.
   */
  height: string
  /**
   * The width of the OEmbed.
   */
  width: string
  /**
   * The version of the OEmbed.
   */
  version: string
  /**
   * The provider name of the OEmbed.
   */
  provider_name: string
  /**
   * The provider URL of the OEmbed.
   */
  provider_url: string
  /**
   * The thumbnail height of the OEmbed.
   */
  thumbnail_height: string
  /**
   * The thumbnail width of the OEmbed.
   */
  thumbnail_width: string
  /**
   * The thumbnail URL of the OEmbed.
   */
  thumbnail_url: string
  /**
   * The HTML for the OEmbed.
   */
  html: string
}
