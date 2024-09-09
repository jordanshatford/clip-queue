import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { ColorOption } from '@cq/ui'
import { colors, setColorPalette, surfaces } from '@cq/ui'

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

export interface ThemePreferences {
  theme: Theme
  primary: ColorOption
  surface: ColorOption
}

export const DEFAULTS: ThemePreferences = {
  theme: 'light',
  primary: structuredClone(colors[12]), // Purple
  surface: structuredClone(surfaces[2]) // Zinc
}

export const useTheme = defineStore(
  'theme',
  () => {
    const preferences = ref<ThemePreferences>(structuredClone(DEFAULTS))
    preferences.value.theme = getInferredDefaultTheme(DEFAULTS.theme)

    watch(preferences, updatePreferences, { deep: true })

    const isDark = computed(() => preferences.value.theme === 'dark')

    const isModifiedFrom = computed(() => {
      return (p: ThemePreferences) => {
        return (
          preferences.value.primary.name !== p.primary.name ||
          preferences.value.surface.name !== p.surface.name
        )
      }
    })

    const isModified = computed(() => {
      return isModifiedFrom.value({ ...DEFAULTS })
    })

    function updatePreferences(value: ThemePreferences, old?: ThemePreferences) {
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

    function toggle() {
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
      toggle,
      $reset
    }
  },
  {
    persist: {
      key: 'cq-theme',
      afterHydrate: (ctx) => {
        ctx.store.updatePreferences(ctx.store.preferences)
      }
    }
  }
)
