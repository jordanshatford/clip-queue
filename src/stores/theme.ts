import { defineStore } from "pinia"

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

export function getInferredDefaultTheme(): Theme {
  if (!window.matchMedia) {
    return Theme.DARK
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return Theme.DARK
  } else {
    return Theme.LIGHT
  }
}

export const useTheme = defineStore("theme", {
  persist: {
    key: "theme",
    afterRestore: (ctx) => {
      if (ctx.store.value === Theme.DARK) {
        document?.querySelector("html")?.classList.add(Theme.DARK)
      }
    },
  },
  state: () => ({
    value: getInferredDefaultTheme(),
  }),
  getters: {
    isDark: (state) => state.value === Theme.DARK,
  },
  actions: {
    toggle() {
      this.value = this.value === Theme.DARK ? Theme.LIGHT : Theme.DARK
      document.querySelector("html")?.classList.toggle(Theme.DARK)
    },
  },
})
