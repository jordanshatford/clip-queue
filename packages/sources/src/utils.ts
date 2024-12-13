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
