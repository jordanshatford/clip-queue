import type { Messages, Locale as UILocale } from '@nuxt/ui'

import * as locales from '@nuxt/ui/locale'
import { useColorMode, useDark, useStorage, useToggle, type BasicColorSchema } from '@vueuse/core'

import type { Locale } from '#paraglide/runtime'

import { m } from '#paraglide/messages'
import { baseLocale, isLocale, setLocale } from '#paraglide/runtime'

/**
 * Primary colors available for selection.
 */
export const primaryColors = [
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
] as const

export type PrimaryColorName = (typeof primaryColors)[number]

/**
 * Neutral colors available for selection.
 */
export const neutralColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'taupe',
  'mauve',
  'mist',
  'olive',
] as const

export type NeutralColorName = (typeof neutralColors)[number]

export const DEFAULT_PRIMARY_COLOR: PrimaryColorName = primaryColors[13]! // Purple
export const DEFAULT_SURFACE_COLOR: NeutralColorName = neutralColors[3]! // Neutral

/**
 * Details for each color available for selection as a primary or neutral color.
 */
export const colorDetails: Record<
  PrimaryColorName | NeutralColorName,
  { class: string; text: () => string }
> = {
  amber: { class: 'bg-amber-500', text: m.amber },
  blue: { class: 'bg-blue-500', text: m.blue },
  cyan: { class: 'bg-cyan-500', text: m.cyan },
  emerald: { class: 'bg-emerald-500', text: m.emerald },
  fuchsia: { class: 'bg-fuchsia-500', text: m.fuchsia },
  gray: { class: 'bg-gray-500', text: m.gray },
  green: { class: 'bg-green-500', text: m.green },
  indigo: { class: 'bg-indigo-500', text: m.indigo },
  lime: { class: 'bg-lime-500', text: m.lime },
  mauve: { class: 'bg-mauve-500', text: m.mauve },
  mist: { class: 'bg-mist-500', text: m.mist },
  neutral: { class: 'bg-neutral-500', text: m.neutral },
  olive: { class: 'bg-olive-500', text: m.olive },
  orange: { class: 'bg-orange-500', text: m.orange },
  pink: { class: 'bg-pink-500', text: m.pink },
  purple: { class: 'bg-purple-500', text: m.purple },
  red: { class: 'bg-red-500', text: m.red },
  rose: { class: 'bg-rose-500', text: m.rose },
  slate: { class: 'bg-slate-500', text: m.slate },
  stone: { class: 'bg-stone-500', text: m.stone },
  sky: { class: 'bg-sky-500', text: m.sky },
  taupe: { class: 'bg-taupe-500', text: m.taupe },
  teal: { class: 'bg-teal-500', text: m.teal },
  violet: { class: 'bg-violet-500', text: m.violet },
  yellow: { class: 'bg-yellow-500', text: m.yellow },
  zinc: { class: 'bg-zinc-500', text: m.zinc },
}

/**
 * The available themes.
 */
export const availableThemes = [
  'dark',
  'light',
  'auto',
] as const satisfies readonly BasicColorSchema[]

/**
 * Translations for available themes.
 */
export const themeTranslations: Record<BasicColorSchema, () => string> = {
  dark: m.theme_dark,
  light: m.theme_light,
  auto: m.theme_auto,
}

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

/**
 * Labels used for each of the available locales.
 */
export const localeLabels: Record<Locale, string> = {
  ar: 'عربي (Arabic)',
  de: 'Deutsch (German)',
  en: 'English',
  es: 'Español (Spanish)',
  fr: 'Français (French)',
  hi: 'हिंदी (Hindi)',
  it: 'Italiano (Italian)',
  ja: '日本語 (Japanese)',
  ko: '한국인 (Korean)',
  pt: 'Português (Portuguese)',
  ru: 'русский (Russian)',
  tr: 'Türkçe (Turkish)',
  zh: '中文 (Chinese)',
}

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

  const primary = useStorage<PrimaryColorName>('__cq_preferences_pcolor', DEFAULT_PRIMARY_COLOR)
  const surface = useStorage<NeutralColorName>('__cq_preferences_scolor', DEFAULT_SURFACE_COLOR)

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
