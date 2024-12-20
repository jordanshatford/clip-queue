import { ClipSource } from './types'

/**
 * Get all URLS (if any) from the provided text.
 * @param text - the text containing possible URLs.
 * @returns {string[]} - Array of all URLs.
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
 * Get a submitter UUID based on some parameters.
 * This does not need to differ between channels on a source to ensure that a user
 * cannot spam submit the same clip across different channels.
 *
 * @param source - the source of the clip.
 * @param submitter - the user submitting the message.
 * @returns {string} - the UUID of the submitter.
 */
export function toSubmitterUUID(source: ClipSource, submitter: string): string {
  return `${source.toString().toLowerCase()}:${submitter.toLowerCase()}`
}
