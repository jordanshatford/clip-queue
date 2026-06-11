/**
 * Enumeration for names supported OEmbed providers.
 */
export enum OEmbedProviderName {
  DAILYMOTION = 'Dailymotion',
  MEDAL = 'Medal',
  SOOP = 'Soop',
  STREAMABLE = 'Streamable',
  VIMEO = 'Vimeo',
  RUMBLE = 'Rumble',
  YOUTUBE = 'YouTube',
}

/**
 * Details for a website with OEmbed support.
 */
export interface OEmbedProvider {
  /**
   * The name.
   */
  name: OEmbedProviderName
  /**
   * The OEmbed endpoint for the website.
   */
  endpoint: string
  /**
   * If it requires proxying the request through the backend.
   */
  proxied: boolean
  /**
   * The hostnames supported by the website.
   */
  hostnames: string[]
}

/**
 * List of currently supported OEmbed providers.
 */
export const SUPPORTED_PROVIDERS: OEmbedProvider[] = [
  {
    name: OEmbedProviderName.DAILYMOTION,
    endpoint: 'https://www.dailymotion.com/services/oembed',
    proxied: true,
    hostnames: ['www.dailymotion.com', 'dailymotion.com', 'dai.ly'],
  },
  {
    name: OEmbedProviderName.MEDAL,
    endpoint: 'https://medal.tv/api/oembed',
    proxied: true,
    hostnames: ['www.medal.tv', 'medal.tv'],
  },
  {
    name: OEmbedProviderName.SOOP,
    endpoint: 'https://openapi.sooplive.com/oembed/embedinfo',
    proxied: false,
    hostnames: ['vod.sooplive.com'],
  },
  {
    name: OEmbedProviderName.STREAMABLE,
    endpoint: 'https://api.streamable.com/oembed.json',
    proxied: false,
    hostnames: ['www.streamable.com', 'streamable.com'],
  },
  {
    name: OEmbedProviderName.VIMEO,
    endpoint: 'https://vimeo.com/api/oembed.json',
    proxied: false,
    hostnames: ['www.vimeo.com', 'vimeo.com'],
  },
  {
    name: OEmbedProviderName.RUMBLE,
    endpoint: 'https://rumble.com/api/Media/oembed',
    proxied: true,
    hostnames: ['www.rumble.com', 'rumble.com'],
  },
  {
    name: OEmbedProviderName.YOUTUBE,
    endpoint: 'https://www.youtube.com/oembed?format=json',
    proxied: false,
    hostnames: ['www.youtube.com', 'youtube.com', 'youtu.be'],
  },
]

/**
 * Resolve a OEmbed provider based on a URL.
 * @param url - The URL of the video.
 * @returns An OEmbed provider.
 * @throws Will throw error if no OEmbed provider exists that supports the URL.
 */
export function resolveOEmbedProvider(url: string): OEmbedProvider {
  const provider = SUPPORTED_PROVIDERS.find((p) => {
    try {
      const uri = new URL(url)
      return p.hostnames.includes(uri.hostname.toLowerCase())
    } catch {
      return false
    }
  })
  if (!provider) {
    throw new Error(`No OEmbed provider supports URL: ${url}.`)
  }
  return provider
}
