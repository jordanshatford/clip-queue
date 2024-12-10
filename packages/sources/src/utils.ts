export function getAllURLsFromText(text: string): string[] {
  const urlRegex = /(?:https?):\/\/[\n\S]+/gi
  const urls = text.match(urlRegex)
  if (urls === null) {
    return []
  }
  return [...new Set(urls as string[])]
}
