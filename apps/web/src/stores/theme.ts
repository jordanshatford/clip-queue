import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { type ColorOption, colors, surfaces, setColorPalette } from '@cq/ui'

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
  theme: getInferredDefaultTheme('light'),
  primary: structuredClone(colors[12]), // Violet
  surface: structuredClone(surfaces[2]) // Zinc
}

export const useTheme = defineStore(
  'theme',
  () => {
    const preferences = ref<ThemePreferences>(structuredClone(DEFAULTS))

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

    function setPreferences(p?: ThemePreferences) {
      if (p) {
        preferences.value = p
      }
      setColorPalette('primary', preferences.value.primary.palette)
      setColorPalette('surface', preferences.value.surface.palette)
      if (preferences.value.theme === 'dark') {
        document?.querySelector('html')?.classList.add('dark')
      } else {
        document.querySelector('html')?.classList.remove('dark')
      }
    }

    function toggle() {
      preferences.value.theme = preferences.value.theme === 'dark' ? 'light' : 'dark'
      document.querySelector('html')?.classList.toggle('dark')
    }

    function $reset() {
      setPreferences(structuredClone({ ...DEFAULTS, theme: preferences.value.theme }))
    }

    return {
      preferences,
      isDark,
      isModified,
      isModifiedFrom,
      setPreferences,
      toggle,
      $reset
    }
  },
  {
    persist: {
      key: 'cq-theme',
      afterRestore: (ctx) => {
        ctx.store.setPreferences()
      }
    }
  }
)
