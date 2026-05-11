import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { ColorOption } from '@/assets/palettes'
import type { Locale } from '@/paraglide/runtime'

import { colors, setColorPalette, surfaces } from '@/assets/palettes'
import { baseLocale, isLocale, setLocale } from '@/paraglide/runtime'

/**
 * The theme of the application.
 */
export type Theme = 'dark' | 'light'

/**
 * The available themes.
 */
export const availableThemes = ['dark', 'light'] as const satisfies readonly Theme[]

/**
 * Gets the inferred default theme.
 */
export function getInferredDefaultTheme(fallback: Theme): Theme {
  if (!window.matchMedia) {
    return fallback
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Gets the inferred default language.
 */
export function getInferredDefaultLanguage(fallback: Locale): Locale {
  if (!window.navigator?.language) {
    return fallback
  }

  const language = window.navigator.language

  if (isLocale(language)) {
    return language
  }

  const genericLanguage = language.split('-')[0]

  if (isLocale(genericLanguage)) {
    return genericLanguage
  }

  return fallback
}

/**
 * The user preferences.
 */
export interface UserPreferences {
  language: Locale
  theme: Theme
  primary: ColorOption
  surface: ColorOption
}

export const DEFAULTS: UserPreferences = {
  language: getInferredDefaultLanguage(baseLocale),
  theme: getInferredDefaultTheme('light'),
  primary: structuredClone(colors[12]!), // Purple
  surface: structuredClone(surfaces[2]!), // Zinc
}

export const usePreferences = defineStore(
  'preferences',
  () => {
    const preferences = ref<UserPreferences>(structuredClone(DEFAULTS))

    /**
     * Whether dark mode is enabled.
     */
    const isDark = computed(() => {
      return preferences.value.theme === 'dark'
    })

    /**
     * Whether preferences differ from another preferences object.
     */
    const isModifiedFrom = computed(() => {
      return (p: UserPreferences) => {
        return (
          preferences.value.language !== p.language ||
          preferences.value.theme !== p.theme ||
          preferences.value.primary.name !== p.primary.name ||
          preferences.value.surface.name !== p.surface.name
        )
      }
    })

    /**
     * Whether preferences differ from defaults.
     */
    const isModified = computed(() => {
      return isModifiedFrom.value(DEFAULTS)
    })

    /**
     * Synchronize theme changes with the DOM.
     */
    watch(
      () => preferences.value.theme,
      (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      { immediate: true },
    )

    /**
     * Synchronize locale changes.
     */
    watch(
      () => preferences.value.language,
      (language) => {
        document.documentElement.lang = language

        setLocale(isLocale(language) ? language : DEFAULTS.language, { reload: false })
      },
      { immediate: true },
    )

    /**
     * Synchronize primary palette changes.
     */
    watch(
      () => preferences.value.primary,
      (primary) => {
        setColorPalette('primary', primary.palette)
      },
      { immediate: true },
    )

    /**
     * Synchronize surface palette changes.
     */
    watch(
      () => preferences.value.surface,
      (surface) => {
        setColorPalette('surface', surface.palette)
      },
      { immediate: true },
    )

    /**
     * Toggle between light and dark mode.
     */
    function toggleDark() {
      preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark'
    }

    /**
     * Reset preferences to defaults.
     */
    function reset() {
      preferences.value = structuredClone(DEFAULTS)
    }

    return {
      preferences,
      isDark,
      isModified,
      toggleDark,
      reset,
    }
  },
  {
    persist: {
      key: 'cq-preferences',
    },
  },
)
