import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/paraglide/runtime', async () => {
  const actual = await vi.importActual<typeof import('@/paraglide/runtime')>('@/paraglide/runtime')

  return {
    ...actual,
    setLocale: vi.fn<(locale: string) => void>(),
  }
})

vi.mock('@/assets/palettes', async () => {
  const actual = await vi.importActual<typeof import('@/assets/palettes')>('@/assets/palettes')
  return {
    ...actual,
    setColorPalette: vi.fn<(type: 'primary' | 'surface', palette: palettes.ColorOption) => void>(),
  }
})

import { nextTick } from 'vue'

import * as palettes from '@/assets/palettes'
import { colors, surfaces } from '@/assets/palettes'
import * as runtime from '@/paraglide/runtime'
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SURFACE_COLOR,
  getInferredDefaultLanguage,
  usePreferences,
} from '@/stores/preferences'

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

  describe('preferences', () => {
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
      preferences.primary = colors[0]!
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

    it('updates the primary palette', async () => {
      const preferences = usePreferences()
      preferences.primary = colors[0]!
      await nextTick()
      expect(palettes.setColorPalette).toHaveBeenCalledWith('primary', colors[0])
    })

    it('updates the surface palette', async () => {
      const preferences = usePreferences()
      preferences.surface = surfaces[0]!
      await nextTick()
      expect(palettes.setColorPalette).toHaveBeenCalledWith('surface', surfaces[0])
    })

    it('resets preferences', () => {
      const preferences = usePreferences()
      preferences.primary = colors[0]!
      preferences.surface = surfaces[0]!
      expect(preferences.isModified).toEqual(true)
      preferences.reset()
      expect(preferences.primary.name).toEqual(DEFAULT_PRIMARY_COLOR.name)
      expect(preferences.surface.name).toEqual(DEFAULT_SURFACE_COLOR.name)
      expect(preferences.isModified).toEqual(false)
    })
  })
})
