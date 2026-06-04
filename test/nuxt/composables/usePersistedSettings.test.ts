import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useStorage: vi.fn((_key: string, initialValue: unknown) => ref(initialValue)),
  }
})

describe('usePeristedSettings', () => {
  const defaultSettings = {
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
    },
  }
  const ID = 'testid'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    const settings = usePeristedSettings(ID, defaultSettings)
    expect(settings.state.value).toEqual(defaultSettings)
    expect(settings.isModified.value).toBe(false)
  })

  it('detects modifications in the state', async () => {
    const settings = usePeristedSettings(ID, defaultSettings)
    settings.state.value.notifications.email = false
    expect(settings.isModified.value).toBe(true)
  })

  it('returns isModified to false when changes are reverted manually', () => {
    const settings = usePeristedSettings(ID, defaultSettings)
    settings.state.value.theme = 'light'
    expect(settings.isModified.value).toBe(true)
    settings.state.value.theme = 'dark'
    expect(settings.isModified.value).toBe(false)
  })

  it('resets state to defaults using reset()', () => {
    const settings = usePeristedSettings(ID, defaultSettings)
    settings.state.value.theme = 'light'
    settings.state.value.notifications.push = true
    expect(settings.isModified.value).toBe(true)
    settings.reset()
    expect(settings.state.value).toEqual(defaultSettings)
    expect(settings.isModified.value).toBe(false)
  })

  it('ensures reset() uses a fresh clone (not a reference)', () => {
    const settings = usePeristedSettings(ID, defaultSettings)
    settings.reset()
    settings.state.value.theme = 'blue'
    expect(defaultSettings.theme).toBe('dark')
  })
})
