export function getUrlFromMessage(message: string): string | undefined {
  const urlStart = message.indexOf("http")
  if (urlStart >= 0) {
    const urlEnd = message.indexOf(" ", urlStart)
    const url = message.slice(urlStart, urlEnd > 0 ? urlEnd : undefined)
    return url
  }
  return undefined
}

export function getIdFromUrl(url: string): string {
  const uri = new URL(url)
  const idStart = uri.pathname.lastIndexOf("/")
  return uri.pathname.slice(idStart).split("?")[0].slice(1)
}
