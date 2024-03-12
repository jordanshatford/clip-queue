import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

export function getInferredDefaultTheme(): Theme {
  if (!window.matchMedia) {
    return Theme.DARK
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.DARK
  } else {
    return Theme.LIGHT
  }
}

export const useTheme = defineStore(
  'theme',
  () => {
    const value = ref<Theme>(getInferredDefaultTheme())
    const isDark = computed(() => value.value === Theme.DARK)

    function toggle() {
      value.value = value.value === Theme.DARK ? Theme.LIGHT : Theme.DARK
      document.querySelector('html')?.classList.toggle(Theme.DARK)
    }

    return {
      value,
      isDark,
      toggle
    }
  },
  {
    persist: {
      key: 'cq-theme',
      afterRestore: (ctx) => {
        if (ctx.store.value === Theme.DARK) {
          document?.querySelector('html')?.classList.add(Theme.DARK)
        }
      }
    }
  }
)
