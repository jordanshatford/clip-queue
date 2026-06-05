import { describe, expect, it, vi } from 'vitest'

import { booleanish, booleanish_arg } from '~/utils/commands'

vi.mock('#paraglide/messages', () => ({
  m: {
    on: () => 'on',
    off: () => 'off',
  },
}))

describe('utils/commands/booleanish_arg', () => {
  it('returns translated on/off values', () => {
    expect(booleanish_arg()).toBe('on|off')
  })
})

describe('utils/commands/booleanish', () => {
  it.each(['yes', 'on', 'true', '1', 'enabled'])('returns true for "%s"', (value) => {
    expect(booleanish(value)).toBe(true)
  })

  it.each(['YES', 'ON', 'TRUE', 'ENABLED'])('returns true for uppercase "%s"', (value) => {
    expect(booleanish(value)).toBe(true)
  })

  it.each(['no', 'off', 'false', '0', 'disabled'])('returns false for "%s"', (value) => {
    expect(booleanish(value)).toBe(false)
  })

  it.each(['NO', 'OFF', 'FALSE', 'DISABLED'])('returns false for uppercase "%s"', (value) => {
    expect(booleanish(value)).toBe(false)
  })

  it.each([undefined, '', 'maybe', 'other'])('returns undefined for "%s"', (value) => {
    expect(booleanish(value)).toBeUndefined()
  })
})
