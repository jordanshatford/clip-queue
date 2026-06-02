import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as runtime from '#paraglide/runtime'
import {
  primaryColors,
  neutralColors,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_NEUTRAL_COLOR,
} from '~/stores/preferences'

vi.mock('#paraglide/runtime', async () => {
  const actual = await vi.importActual<typeof import('#paraglide/runtime')>('#paraglide/runtime')
  return {
    ...actual,
    setLocale: vi.fn<(locale: string) => void>(),
  }
})

describe('getInferredDefaultLanguage', () => {
  it('returns exact locale matches', () => {
    vi.stubGlobal('navigator', {
      language: 'en',
    })
    expect(getInferredDefaultLanguage('fr')).toEqual('en')
  })

  it('returns generic locale matches', () => {
    vi.stubGlobal('navigator', {
      language: 'en-CA',
    })
    expect(getInferredDefaultLanguage('fr')).toEqual('en')
  })

  it('falls back when locale is unsupported', () => {
    vi.stubGlobal('navigator', {
      language: 'invalid',
    })
    expect(getInferredDefaultLanguage('fr')).toEqual('fr')
  })
})

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    document.documentElement.className = ''
    document.documentElement.lang = ''
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('initializes with defaults', () => {
    const preferences = usePreferences()
    expect(preferences.primary).toBe(DEFAULT_PRIMARY_COLOR)
    expect(preferences.neutral).toBe(DEFAULT_NEUTRAL_COLOR)
    expect(preferences.isModified).toBe(false)
  })

  it('detects when preferences are modified', () => {
    const preferences = usePreferences()
    expect(preferences.isModified).toBe(false)
    preferences.primary = primaryColors[0]!
    expect(preferences.isModified).toBe(true)
  })

  it('updates html lang and dir via useHead', async () => {
    const preferences = usePreferences()
    preferences.locale = 'fr'
    await nextTick()
    await new Promise(requestAnimationFrame)
    expect(document.documentElement.lang).toBe('fr')
    expect(document.documentElement.dir).toBe('ltr')
  })

  it('calls setLocale when language changes', async () => {
    const preferences = usePreferences()
    preferences.locale = 'fr'
    await nextTick()
    expect(runtime.setLocale).toHaveBeenCalledWith('fr', {
      reload: false,
    })
  })

  it('updates the primary color via app config', async () => {
    const preferences = usePreferences()
    preferences.primary = primaryColors[0]!
    await nextTick()
    const config = useAppConfig()
    expect(config.ui.colors.primary).toBe(primaryColors[0]!.toLowerCase())
  })

  it('updates the neutral color via app config', async () => {
    const preferences = usePreferences()
    preferences.neutral = neutralColors[0]!
    await nextTick()
    const config = useAppConfig()
    expect(config.ui.colors.neutral).toBe(neutralColors[0]!.toLowerCase())
  })

  it('resets preferences', () => {
    const preferences = usePreferences()
    preferences.primary = primaryColors[0]!
    preferences.neutral = neutralColors[0]!
    expect(preferences.isModified).toBe(true)
    preferences.reset()
    expect(preferences.primary).toBe(DEFAULT_PRIMARY_COLOR)
    expect(preferences.neutral).toBe(DEFAULT_NEUTRAL_COLOR)
    expect(preferences.isModified).toBe(false)
  })
})
