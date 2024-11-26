import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { ColorOption } from '@cq/ui'
import { colors, setColorPalette, surfaces } from '@cq/ui'

import type { AvailableLanguageTag } from '@/paraglide/runtime'
import { availableLanguageTags, setLanguageTag } from '@/paraglide/runtime'

type Theme = 'dark' | 'light'

export function getInferredDefaultTheme(fallback: Theme): Theme {
  if (!window.matchMedia) {
    return fallback
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  } else {
    return 'light'
  }
}

export function getInferredDefaultLanguage(fallback: AvailableLanguageTag): AvailableLanguageTag {
  if (!window.navigator?.language) {
    return fallback
  }
  if (window.navigator.language) {
    return window.navigator.language.split('-')[0] as AvailableLanguageTag
  }
  return fallback
}

export interface ThemePreferences {
  language: AvailableLanguageTag
  theme: Theme
  primary: ColorOption
  surface: ColorOption
}

export const DEFAULTS: ThemePreferences = {
  language: 'en',
  theme: 'light',
  primary: structuredClone(colors[12]), // Purple
  surface: structuredClone(surfaces[2]) // Zinc
}

export const usePreferences = defineStore(
  'preferences',
  () => {
    const preferences = ref<ThemePreferences>(structuredClone(DEFAULTS))
    preferences.value.language = getInferredDefaultLanguage(DEFAULTS.language)
    preferences.value.theme = getInferredDefaultTheme(DEFAULTS.theme)

    watch(preferences, updatePreferences, { deep: true })

    const isDark = computed(() => preferences.value.theme === 'dark')

    const isModifiedFrom = computed(() => {
      return (p: ThemePreferences) => {
        return (
          preferences.value.language !== p.language ||
          preferences.value.primary.name !== p.primary.name ||
          preferences.value.surface.name !== p.surface.name
        )
      }
    })

    const isModified = computed(() => {
      return isModifiedFrom.value({ ...DEFAULTS })
    })

    function updatePreferences(value: ThemePreferences, old?: ThemePreferences) {
      if (value.language !== old?.language) {
        if (availableLanguageTags.includes(value.language)) {
          setLanguageTag(value.language)
        } else {
          setLanguageTag(DEFAULTS.language)
        }
      }
      if (value.primary.name !== old?.primary.name) {
        setColorPalette('primary', value.primary.palette)
      }
      if (value.surface.name !== old?.surface.name) {
        setColorPalette('surface', value.surface.palette)
      }
      if (value.theme !== old?.theme) {
        if (value.theme === 'dark') {
          document?.querySelector('html')?.classList.add('app-dark')
        } else {
          document.querySelector('html')?.classList.remove('app-dark')
        }
      }
    }

    function toggleTheme() {
      preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark'
      document.querySelector('html')?.classList.toggle('app-dark')
    }

    function $reset() {
      preferences.value = { ...DEFAULTS, theme: preferences.value.theme }
    }

    return {
      preferences,
      isDark,
      isModified,
      isModifiedFrom,
      updatePreferences,
      toggleTheme,
      $reset
    }
  },
  {
    persist: {
      key: 'cq-preferences',
      afterHydrate: (ctx) => {
        ctx.store.updatePreferences(ctx.store.preferences)
      }
    }
  }
)