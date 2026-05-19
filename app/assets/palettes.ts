export const surfaces: string[] = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'taupe',
  'mauve',
  'mist',
  'olive',
]
export const colors: string[] = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

/**
 * Sets the color palette of the primary or surface color.
 * @param type - The type of the color palette.
 * @param option - The color to set.
 */
export function setColorPalette(type: 'primary' | 'surface', option: string): void {
  const c = useAppConfig()
  if (type === 'primary') {
    c.ui.colors.primary = option.toLowerCase()
  } else {
    c.ui.colors.neutral = option.toLowerCase()
  }
}
