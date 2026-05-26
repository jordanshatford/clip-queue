import type { Clip } from '~/integrations'

import { fromSubmitterUUID, toClipUUID } from '~/integrations/core'

/**
 * Max count to show for number of submitters. Anything above will be capped with
 * a '+' indicating there are more than that many submitters.
 */
const MAX_COUNT = 9999

/**
 * Convert a clip to a subtitle.
 * @param original - The clip.
 * @returns A string representing the clips subtitle.
 */
function toSubtitle(original: Clip): string {
  if (original.category) {
    return `${original.channel} - ${original.category}`
  }
  return original.channel
}

/**
 * Convert a clip to a string representing the number of submitters.
 * @param original - The clip.
 * @returns A string representing the number of submitters.
 */
function toCount(original: Clip): string | undefined {
  if (original.submitters.length < 2) {
    return undefined
  }
  return original.submitters.length > MAX_COUNT ? `${MAX_COUNT}+` : `${original.submitters.length}`
}

/**
 * Composable for additional functionality with clip handling.
 * @param original - The original clip.
 */
export function useClip(original: Clip) {
  const integrations = useIntegrations()
  /**
   * UUID of the clip.
   */
  const uuid = toClipUUID(original)
  /**
   * The subtitle of the clip.
   */
  const subtitle = toSubtitle(original)
  /**
   * The submitter and source of the clip.
   */
  const { source: sourceId, submitter } = fromSubmitterUUID(original.submitters[0] ?? 'Unknown')
  /**
   * The count of submitters for the clip.
   */
  const count = toCount(original)
  /**
   * Source of the clip.
   */
  const source = sourceId ? integrations.source(sourceId) : undefined
  /**
   * Provider of the clip.
   */
  const provider = integrations.provider(original.provider)
  /**
   * Player configuration of the clip.
   */
  const playerConfig = provider?.getPlayerConfig(original)
  /**
   * Check if this clip equals another clip.
   * @param other - The other clip.
   * @returns True if they are equal, false otherwise.
   */
  function equals(other: Clip): boolean {
    return uuid === toClipUUID(other)
  }
  return {
    original,
    uuid,
    subtitle,
    source,
    submitter,
    count,
    provider,
    playerConfig,
    equals,
  }
}
