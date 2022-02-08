export function formatTemplateString(str: string, values: Record<string, string>): string {
  for (const val of Object.keys(values)) {
    const regex = new RegExp(`{${val}}`, "g")
    str = str.replace(regex, values[val])
  }
  return str
}
