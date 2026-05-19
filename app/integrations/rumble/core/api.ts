import type { OEmbedResponse } from '@/integrations/misc'

import { getOEmbedProxied } from '@/integrations/misc/core/api'

const BASE_URL = 'https://rumble.com/api/Media/oembed'

/**
 * Get Rumble oembed details by URL.
 * @param id - The video/shorts URL.
 * @returns The oembed details.
 * @throws Will throw an error if no video URL is provided or the fetch fails.
 */
export async function getRumbleOEmbed(url: string): Promise<OEmbedResponse> {
  if (url.length <= 0) {
    throw new Error('URL was not provided.')
  }
  const u = `${BASE_URL}?url=${url}`
  const data = await getOEmbedProxied(u)
  return data
}
