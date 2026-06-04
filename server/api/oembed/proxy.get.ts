/**
 * Geneic OEmbed response.
 */
export interface OEmbedResponse {
  /**
   * The title of the OEmbed.
   */
  title: string
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
   * The author name of the OEmbed.
   */
  author_name?: string
  /**
   * The author URL the OEmbed.
   */
  author_url?: string
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
  /**
   * The description of the OEmbed.
   */
  description?: string
  /**
   * The upload date of the OEmbed.
   */
  upload_date?: string
}

const ALLOWED_HOSTNAMES: string[] = ['medal.tv', 'www.dailymotion.com', 'rumble.com']

export default defineCachedEventHandler(
  async (event): Promise<OEmbedResponse> => {
    const query = getQuery<{ url?: string }>(event)

    if (!query.url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing url query parameter for OEmbed.',
      })
    }

    try {
      const uri = new URL(query.url)
      if (!ALLOWED_HOSTNAMES.includes(uri.hostname)) {
        throw new Error('Invalid url hostname for OEmbed')
      }
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid url query parameter for OEmbed.',
      })
    }

    return await $fetch<OEmbedResponse>(query.url)
  },
  { maxAge: 60 * 60 },
)
