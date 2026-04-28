import type { Clip } from '@/integrations'

import { IntegrationID } from '@/integrations'

/**
 * Generate a unique key for an integration assuming that the key value is unique.
 * @param integration - The current integration (assumes all integrations have unique id).
 * @param key - The unique key for the integration.
 * @returns string - unique
 */
export function key(integration: { id: string }, key: string): string {
  return `__cqi_${integration.id}_${key}`
}

/**
 * Get a UUID for the provided clip.
 * @param clip - A clip.
 * @returns UUID of the clip.
 */
export function toClipUUID(clip: Clip): string {
  return `${clip.provider.toString().toLowerCase()}:${clip.id.toLowerCase()}`
}

/**
 * Get all URLS (if any) from the provided text.
 * @param text - the text containing possible URLs.
 * @returns Array of all URLs.
 */
export function getAllURLsFromText(text: string): string[] {
  const urlRegex = /(?:https?):\/\/[\n\S]+/gi
  const urls = text.match(urlRegex)
  if (urls === null) {
    return []
  }
  return [...new Set(urls as string[])]
}

/**
 * Get the source and submitter from a submitter UUID.
 * @param uuid - the UUID of the submitter.
 * @returns the source and submitter from the UUID.
 */
export function fromSubmitterUUID(uuid: string): [IntegrationID, string] {
  // Format of the UUID is either `source:submitter` or just `submitter`.
  // In the latter case, the source is unknown.
  const [submitter = '', source] = uuid.split(':').reverse()
  if (!source) {
    return [IntegrationID.UNKNOWN, submitter]
  }
  return [source as IntegrationID, submitter]
}

/**
 * Get a submitter UUID based on some parameters.
 * This does not need to differ between channels on a source to ensure that a user
 * cannot spam submit the same clip across different channels.
 *
 * @param source - the source of the clip.
 * @param submitter - the user submitting the message.
 * @returns the UUID of the submitter.
 */
export function toSubmitterUUID(source: IntegrationID, submitter: string): string {
  return `${source.toString()}:${submitter.toLowerCase()}`
}
