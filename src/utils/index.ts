export function getAllURLsFromText(text: string): string[] {
  const urlRegex = /(?:https?):\/\/[\n\S]+/gi
  const urls = text.match(urlRegex)
  return (urls === null ? [] : urls) as string[]
}

export function clone<T>(obj: T, deep = false): T {
  if (deep) {
    return JSON.parse(JSON.stringify(obj))
  } else {
    return Object.assign({}, obj)
  }
}
