import { m } from '#paraglide/messages'

/**
 * Function that looks like a Inlang ParaglideJS translation for a booleanish argument.
 * @returns () => string
 */
export function booleanish_arg(): string {
  return `${m.on()}|${m.off()}`
}

const BOOLEANISH_TRUE: string[] = ['yes', 'on', 'true', '1', 'enabled']
const BOOLEANISH_FALSE: string[] = ['no', 'off', 'false', '0', 'disabled']
/**
 * Convert an argument to a booleanish value.
 * @param arg - The argument.
 * @returns True/False if the argument is a boolean like value, undefined otherwise.
 */
export function booleanish(arg?: string): boolean | undefined {
  if (!arg) {
    return
  }
  const value = arg.toLowerCase()
  if (BOOLEANISH_TRUE.includes(value)) {
    return true
  }
  if (BOOLEANISH_FALSE.includes(value)) {
    return false
  }
}
