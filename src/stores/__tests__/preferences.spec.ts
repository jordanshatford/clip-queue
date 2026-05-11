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
    setColorPalette: vi.fn<(type: 'primary' | 'surface', palette: palettes.ColorPalette) => void>(),
  }
})

import * as palettes from '@/assets/palettes'
import { colors, surfaces } from '@/assets/palettes'
import * as runtime from '@/paraglide/runtime'
import {
  DEFAULTS,
  getInferredDefaultLanguage,
  getInferredDefaultTheme,
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

  describe('getInferredDefaultTheme', () => {
    it('returns dark when preferred', () => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
          matches: true,
          media: '',
          onchange: null,
        })),
      )

      expect(getInferredDefaultTheme('light')).toEqual('dark')
    })

    it('returns light when dark mode is not preferred', () => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
          matches: false,
          media: '',
          onchange: null,
        })),
      )

      expect(getInferredDefaultTheme('dark')).toEqual('light')
    })
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

  describe('store', () => {
    it('initializes with defaults', () => {
      const preferences = usePreferences()

      expect(preferences.preferences).toEqual(DEFAULTS)
      expect(preferences.isModified).toEqual(false)
    })

    it('detects dark mode', () => {
      const preferences = usePreferences()

      preferences.preferences.theme = 'dark'

      expect(preferences.isDark).toEqual(true)

      preferences.preferences.theme = 'light'

      expect(preferences.isDark).toEqual(false)
    })

    it('detects when preferences are modified', () => {
      const preferences = usePreferences()

      expect(preferences.isModified).toEqual(false)

      preferences.preferences.theme = 'dark'

      expect(preferences.isModified).toEqual(true)
    })

    it('toggles dark mode', () => {
      const preferences = usePreferences()

      preferences.preferences.theme = 'light'

      preferences.toggleDark()

      expect(preferences.preferences.theme).toEqual('dark')

      preferences.toggleDark()

      expect(preferences.preferences.theme).toEqual('light')
    })

    it('updates the html dark class', async () => {
      const preferences = usePreferences()

      preferences.preferences.theme = 'dark'

      await Promise.resolve()

      expect(document.documentElement.classList.contains('dark')).toEqual(true)

      preferences.preferences.theme = 'light'

      await Promise.resolve()

      expect(document.documentElement.classList.contains('dark')).toEqual(false)
    })

    it('updates the html lang attribute', async () => {
      const preferences = usePreferences()

      preferences.preferences.language = 'fr'

      await Promise.resolve()

      expect(document.documentElement.lang).toEqual('fr')
    })

    it('calls setLocale when language changes', async () => {
      const preferences = usePreferences()

      preferences.preferences.language = 'fr'

      await Promise.resolve()

      expect(runtime.setLocale).toHaveBeenCalledWith('fr', {
        reload: false,
      })
    })

    it('updates the primary palette', async () => {
      const preferences = usePreferences()

      preferences.preferences.primary = colors[0]!

      await Promise.resolve()

      expect(palettes.setColorPalette).toHaveBeenCalledWith('primary', colors[0]!.palette)
    })

    it('updates the surface palette', async () => {
      const preferences = usePreferences()

      preferences.preferences.surface = surfaces[0]!

      await Promise.resolve()

      expect(palettes.setColorPalette).toHaveBeenCalledWith('surface', surfaces[0]!.palette)
    })

    it('resets preferences', () => {
      const preferences = usePreferences()

      preferences.preferences.theme = 'dark'
      preferences.preferences.language = 'fr'

      expect(preferences.isModified).toEqual(true)

      preferences.reset()

      expect(preferences.preferences).toEqual(DEFAULTS)
      expect(preferences.isModified).toEqual(false)
    })

    it('does not mutate DEFAULTS during reset', () => {
      const preferences = usePreferences()

      preferences.preferences.primary.name = 'amber'

      expect(DEFAULTS.primary.name).not.toEqual('amber')
    })
  })
})
