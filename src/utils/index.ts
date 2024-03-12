export function getAllURLsFromText(text: string): string[] {
  const urlRegex = /(?:https?):\/\/[\n\S]+/gi
  const urls = text.match(urlRegex)
  return (urls === null ? [] : urls) as string[]
}
