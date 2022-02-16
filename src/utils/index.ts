export function getUrlFromMessage(message: string): string | undefined {
  const urlStart = message.indexOf("http")
  if (urlStart >= 0) {
    const urlEnd = message.indexOf(" ", urlStart)
    const url = message.slice(urlStart, urlEnd > 0 ? urlEnd : undefined)
    return url
  }
  return undefined
}

export function formatTemplateString(str: string, values: Record<string, string>): string {
  for (const val of Object.keys(values)) {
    const regex = new RegExp(`{${val}}`, "g")
    str = str.replace(regex, values[val])
  }
  return str
}
