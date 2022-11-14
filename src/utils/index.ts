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

/* eslint-disable @typescript-eslint/no-explicit-any*/
export function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y
}

export function clone<T>(obj: T, deep = false): T {
  if (deep) {
    return JSON.parse(JSON.stringify(obj))
  } else {
    return Object.assign({}, obj)
  }
}

export function toRangeArray(start: number, end: number): number[] {
  return Array.from({ length: end + 1 - start }, (_v, k) => k + start)
}
