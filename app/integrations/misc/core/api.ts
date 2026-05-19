import type { OEmbedResponse } from './types'

/**
 * Get a oembed details provided a URL.
 * @param url - The URL to send a GET request to.
 * @returns The video oembed details.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getOEmbed(url: string): Promise<OEmbedResponse> {
  if (url.length <= 0) {
    throw new Error('URL was not provided.')
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch OEmbed with URL ${url}: ${response.statusText}`)
  }
  const data: OEmbedResponse = await response.json()
  return data
}

/**
 * Cors proxy server details.
 */
interface CorsProxy {
  /**
   * The base for the server. Expects the URL directly after.
   */
  base: string
  /**
   * Response handler to detect any unique to server errors.
   * @param response - The fetch response from the proxy.
   * @returns OEmbedResponse data promise.
   */
  handleResponse: (response: Response) => Promise<OEmbedResponse>
}

const PROXY: CorsProxy = {
  base: 'https://api.codetabs.com/v1/proxy/?quest=',
  handleResponse: async (response) => {
    /**
     * When failing, we see data still return in JSON format, and a successful
     * 200 response. Check the response data to validate if we have actually failed.
     * {
     *   "additionalInfo": [],
     *.  "errorId": 1,
     *.  "errorMessage": "The requested entity could not be found",
     *.  "httpStatusCode": 404
     * }
     */
    const data = await response.json()
    if (data['errorId'] || data['errorMessage']) {
      throw new Error(`Failed to handle proxied response: ${data['errorMessage']}`)
    }
    return data as OEmbedResponse
  },
}

/**
 * Get a oembed details provided a URL but proxied to bypass CORS.
 * @param url - The URL to send a GET request to.
 * @returns The video oembed details.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getOEmbedProxied(url: string): Promise<OEmbedResponse> {
  if (url.length <= 0) {
    throw new Error('URL was not provided.')
  }
  const response = await fetch(`${PROXY.base}${url}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch OEmbed with URL ${url}: ${response.statusText}`)
  }
  const data = await PROXY.handleResponse(response)
  return data
}
