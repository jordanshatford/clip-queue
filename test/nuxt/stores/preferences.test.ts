import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import * as runtime from '#paraglide/runtime'
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SURFACE_COLOR,
  primaryColors,
  neutralColors,
} from '~/stores/preferences'

vi.mock('#paraglide/runtime', async () => {
  const actual = await vi.importActual<typeof import('#paraglide/runtime')>('#paraglide/runtime')
  return {
    ...actual,
    setLocale: vi.fn<(locale: string) => void>(),
  }
})

describe('preferences.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    document.documentElement.className = ''
    document.documentElement.lang = ''

    setActivePinia(createPinia())

    vi.clearAllMocks()
    vi.unstubAllGlobals()
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
      usePreferences().reset()
    })

    it('initializes with defaults', () => {
      const preferences = usePreferences()
      expect(preferences.primary).toEqual(DEFAULT_PRIMARY_COLOR)
      expect(preferences.surface).toEqual(DEFAULT_SURFACE_COLOR)
      expect(preferences.isModified).toEqual(false)
    })

    it('detects dark mode', async () => {
      const preferences = usePreferences()
      preferences.mode = 'dark'
      await nextTick()
      expect(preferences.isDark).toEqual(true)
      preferences.mode = 'light'
      await nextTick()
      expect(preferences.isDark).toEqual(false)
    })

    it('detects when preferences are modified', () => {
      const preferences = usePreferences()
      expect(preferences.isModified).toEqual(false)
      preferences.primary = primaryColors[0]!
      expect(preferences.isModified).toEqual(true)
    })

    it('toggles dark mode', async () => {
      const preferences = usePreferences()
      preferences.mode = 'light'
      await nextTick()
      preferences.toggleDark()
      await nextTick()
      expect(preferences.mode).toEqual('dark')
      preferences.toggleDark()
      await nextTick()
      expect(preferences.mode).toEqual('light')
    })

    it('updates the html dark class', async () => {
      const preferences = usePreferences()
      preferences.mode = 'dark'
      await nextTick()
      expect(document.documentElement.classList.contains('dark')).toEqual(true)
      preferences.mode = 'light'
      await nextTick()
      expect(document.documentElement.classList.contains('dark')).toEqual(false)
    })

    it('updates the html lang attribute', async () => {
      const preferences = usePreferences()
      preferences.locale = 'fr'
      await nextTick()
      expect(document.documentElement.lang).toEqual('fr')
    })

    it('calls setLocale when language changes', async () => {
      const preferences = usePreferences()
      preferences.locale = 'fr'
      await nextTick()
      expect(runtime.setLocale).toHaveBeenCalledWith('fr', {
        reload: false,
      })
    })

    it('updates the primary palette via app config', async () => {
      const preferences = usePreferences()
      preferences.primary = primaryColors[0]!
      await nextTick()
      const config = useAppConfig()
      expect(config.ui.colors.primary).toBe(primaryColors[0]!.toLowerCase())
    })

    it('updates the surface palette via app config', async () => {
      const preferences = usePreferences()
      preferences.surface = neutralColors[0]!
      await nextTick()
      const config = useAppConfig()
      expect(config.ui.colors.neutral).toBe(neutralColors[0]!.toLowerCase())
    })

    it('resets preferences', () => {
      const preferences = usePreferences()
      preferences.primary = primaryColors[0]!
      preferences.surface = neutralColors[0]!
      expect(preferences.isModified).toEqual(true)
      preferences.reset()
      expect(preferences.primary).toEqual(DEFAULT_PRIMARY_COLOR)
      expect(preferences.surface).toEqual(DEFAULT_SURFACE_COLOR)
      expect(preferences.isModified).toEqual(false)
    })
  })
})
