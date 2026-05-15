import { useColorMode, useDark, useStorage, useToggle, type BasicColorSchema } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'

import type { ColorOption } from '@/assets/palettes'
import type { Locale } from '@/paraglide/runtime'

import { colors, setColorPalette, surfaces } from '@/assets/palettes'
import { baseLocale, isLocale, setLocale } from '@/paraglide/runtime'

/**
 * The available themes.
 */
export const availableThemes = ['dark', 'light'] as const satisfies readonly BasicColorSchema[]

/**
 * Gets the inferred default language.
 */
export function getInferredDefaultLanguage(fallback: Locale = baseLocale): Locale {
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

export const DEFAULT_PRIMARY_COLOR: ColorOption = structuredClone(colors[12]!) // Purple
export const DEFAULT_SURFACE_COLOR: ColorOption = structuredClone(surfaces[3]!) // Neutral

/**
 * Store used to track and manage user preferences.
 */
export const usePreferences = defineStore('preferences', () => {
  /**
   * Current color mode being used (dark, light).
   */
  const mode = useColorMode()
  /**
   * If we are in dark mode.
   */
  const isDark = useDark()
  /**
   * Toggle between dark and light mode.
   */
  const toggleDark = useToggle(isDark)

  /**
   * Current locale being used.
   */
  const locale = useStorage<Locale>('__cq_preferences_locale', getInferredDefaultLanguage())

  /**
   * Synchronize locale changes to update the user interface.
   */
  watch(
    () => locale.value,
    (language) => {
      document.documentElement.lang = language
      setLocale(isLocale(language) ? language : getInferredDefaultLanguage(), { reload: false })
    },
    { immediate: true },
  )

  const primary = useStorage<ColorOption>('__cq_preferences_pcolor', DEFAULT_PRIMARY_COLOR)
  const surface = useStorage<ColorOption>('__cq_preferences_scolor', DEFAULT_SURFACE_COLOR)

  /**
   * Synchronize primary palette changes.
   */
  watch(
    () => primary.value,
    (primary) => {
      setColorPalette('primary', primary)
    },
    { immediate: true },
  )

  /**
   * Synchronize surface palette changes.
   */
  watch(
    () => surface.value,
    (surface) => {
      setColorPalette('surface', surface)
    },
    { immediate: true },
  )

  /**
   * Whether preferences differ from defaults.
   */
  const isModified = computed(() => {
    return (
      primary.value.name !== DEFAULT_PRIMARY_COLOR.name ||
      surface.value.name !== DEFAULT_SURFACE_COLOR.name
    )
  })

  /**
   * Reset preferences to defaults. Ignore modifying the selected color scheme or locale.
   */
  function reset() {
    primary.value = DEFAULT_PRIMARY_COLOR
    surface.value = DEFAULT_SURFACE_COLOR
  }

  return {
    mode,
    isDark,
    toggleDark,
    locale,
    primary,
    surface,
    isModified,
    reset,
  }
})
