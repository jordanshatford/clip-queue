import type { Messages, Locale as UILocale } from '@nuxt/ui'

import * as locales from '@nuxt/ui/locale'
import { useColorMode, useDark, useStorage, useToggle, type BasicColorSchema } from '@vueuse/core'

import type { Locale } from '#paraglide/runtime'

import { baseLocale, isLocale, setLocale } from '#paraglide/runtime'

/**
 * Primary colors available for selection.
 */
export const primaryColors: string[] = [
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
 * Neutral colors available for selection.
 */
export const neutralColors: string[] = [
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

/**
 * The available themes.
 */
export const availableThemes = [
  'dark',
  'light',
  'auto',
] as const satisfies readonly BasicColorSchema[]

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

export const DEFAULT_PRIMARY_COLOR: string = primaryColors[13]! // Purple
export const DEFAULT_SURFACE_COLOR: string = neutralColors[3]! // Neutral

/**
 * Store used to track and manage user preferences.
 */
export const usePreferences = defineStore('preferences', () => {
  const config = useAppConfig()
  /**
   * Current color mode being used (dark, light).
   */
  const mode = useColorMode()
  const { store } = useColorMode()
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
   * Current local be used as expected by the UI library UApp.
   */
  const uilocale = computed<UILocale<Messages>>(() => {
    // Special case for Chinese since the locale code is different between paraglide and nuxt/ui.
    const key = locale.value === 'zh' ? 'zh_cn' : locale.value
    return locales[key]
  })

  /**
   * Computed property for the lang HTML attribute based on the current locale.
   */
  const lang = computed(() => locale.value)
  /**
   * Computed property for the dir HTML attribute based on the current locale's directionality as defined in the UI library.
   */
  const dir = computed(() => uilocale.value.dir)

  /**
   * Set HTML attributes for language and text direction based on the current locale to ensure proper rendering and accessibility.
   */
  useHead({
    htmlAttrs: {
      lang: lang,
      dir: dir,
    },
  })

  /**
   * Synchronize locale changes to update the user interface.
   */
  watch(
    () => locale.value,
    (language) => {
      setLocale(isLocale(language) ? language : getInferredDefaultLanguage(), { reload: false })
    },
    { immediate: true },
  )

  const primary = useStorage<string>('__cq_preferences_pcolor', DEFAULT_PRIMARY_COLOR)
  const surface = useStorage<string>('__cq_preferences_scolor', DEFAULT_SURFACE_COLOR)

  /**
   * Synchronize primary palette changes.
   */
  watch(
    () => primary.value,
    (primary) => {
      config.ui.colors.primary = primary.toLowerCase()
    },
    { immediate: true },
  )

  /**
   * Synchronize surface palette changes.
   */
  watch(
    () => surface.value,
    (surface) => {
      config.ui.colors.neutral = surface.toLowerCase()
    },
    { immediate: true },
  )

  /**
   * Whether preferences differ from defaults.
   */
  const isModified = computed(() => {
    return primary.value !== DEFAULT_PRIMARY_COLOR || surface.value !== DEFAULT_SURFACE_COLOR
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
    store,
    isDark,
    toggleDark,
    locale,
    uilocale,
    primary,
    surface,
    isModified,
    reset,
  }
})
