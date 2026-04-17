import { ClipSource } from './types'

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
export function fromSubmitterUUID(uuid: string): [ClipSource, string] {
  // Format of the UUID is either `source:submitter` or just `submitter`.
  // In the latter case, the source is unknown.
  const [submitter = '', source] = uuid.split(':').reverse()
  if (!source) {
    return [ClipSource.UNKNOWN, submitter]
  }
  return [source as ClipSource, submitter]
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
export function toSubmitterUUID(source: ClipSource, submitter: string): string {
  return `${source.toString()}:${submitter.toLowerCase()}`
}
