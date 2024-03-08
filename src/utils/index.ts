export function getAllURLsFromText(text: string): string[] {
  const urlRegex = /(?:https?):\/\/[\n\S]+/gi
  const urls = text.match(urlRegex)
  return (urls === null ? [] : urls) as string[]
}

/* eslint-disable @typescript-eslint/no-explicit-any*/
export function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
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
