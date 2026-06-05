import type { KickClip, KickVideo, KickChannelPartial } from './types'

const BASE_URL = 'https://kick.com/api'

/**
 * Get a Kick clip by ID.
 * @param id - The Kick clip ID.
 * @returns The Kick clip.
 * @throws Will throw an error if no clip ID is provided or the fetch fails.
 */
export async function getClip(id: string): Promise<KickClip> {
  if (id.length <= 0) {
    throw new Error('Clip ID was not provided.')
  }
  const result = await $fetch<{ clip: KickClip }>(`${BASE_URL}/v2/clips/${id}`)
  return result.clip
}

/**
 * Get a Kick video by ID.
 * @param id - The Kick video ID.
 * @returns The Kick video.
 * @throws Will throw an error if no video ID is provided or the fetch fails.
 */
export async function getVideo(id: string): Promise<KickVideo> {
  if (id.length <= 0) {
    throw new Error('Video ID was not provided.')
  }
  return await $fetch<KickVideo>(`${BASE_URL}/v1/video/${id}`)
}

/**
 * Get a Kick channel by name.
 * @param channel - The Kick channel name.
 * @returns The Kick channel.
 * @throws Will throw an error if no channel name is provided or the fetch fails.
 *
 * @note This currently only returns partial channel details required by
 *       our application.
 */
export async function getChannel(channel: string): Promise<KickChannelPartial> {
  if (channel.length <= 0) {
    throw new Error('Channel name was not provided.')
  }
  return await $fetch<KickChannelPartial>(`${BASE_URL}/v2/channels/${channel}`)
}
