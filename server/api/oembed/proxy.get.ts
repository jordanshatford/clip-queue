import type { OEmbedResponse } from '#shared/oembed'

import { resolveOEmbedProvider } from '#shared/oembed'

/**
 * Proxy request to one of our supported OEmbed provider to prevent CORS issues.
 */
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
      // Validate that the OEmbed URL is a provider that we support.
      const uri = new URL(query.url)
      const original = uri.searchParams.get('url')
      if (!original) {
        throw new Error('Invalid url for OEmbed')
      }
      resolveOEmbedProvider(original)
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
