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
export function useClip(clip: MaybeRef<Clip>) {
  const integrations = useIntegrations()
  const original = toRef(clip)

  const value = computed(() => {
    const c: Clip = original.value
    const uuid = toClipUUID(c)
    const subtitle = toSubtitle(c)
    const first = fromSubmitterUUID(c.submitters[0] ?? 'Unknown')
    const submitter = first.submitter
    const count = toCount(c)
    const submitters = c.submitters.map((s) => {
      const { source, submitter: sub } = fromSubmitterUUID(s)
      return {
        icon: integrations.integration(source)?.branding.icon,
        label: sub,
      }
    })
    const source = first.source ? integrations.source(first.source) : undefined
    const provider = integrations.provider(c.provider)
    const playerConfig = provider?.getPlayerConfig(c)

    return {
      /**
       * The original clip.
       */
      original: c,
      /**
       * UUID of the clip.
       */
      uuid,
      /**
       * The subtitle of the clip.
       */
      subtitle,
      /**
       * The first submitter of the clip.
       */
      submitter,
      /**
       * The count of submitters for the clip.
       */
      count,
      /**
       * The submitters of the clips as a list of names and icons for the source.
       */
      submitters,
      /**
       * The first source of the clip.
       */
      source,
      /**
       * The provider of the clip.
       */
      provider,
      /**
       * The player configuration of the clip.
       */
      playerConfig,
      /**
       * Check if this clip equals the other clip.
       * @param other - The other clip.
       * @returns True if they are equal, false otherwise.
       */
      equals: (other: Clip) => uuid === toClipUUID(other),
    }
  })

  return value
}
