import { defineStore } from "pinia"

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const LOCAL_STORAGE_KEY = "theme"

export const useTheme = defineStore("theme", {
  state: () => ({
    value: Theme.DARK,
  }),
  getters: {
    isDark: (state) => state.value === Theme.DARK,
  },
  actions: {
    getDefault() {
      const theme = localStorage?.getItem(LOCAL_STORAGE_KEY)
      if (theme) {
        this.value = theme as Theme
      } else {
        if (window.matchMedia) {
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.value = Theme.DARK
          } else {
            this.value = Theme.LIGHT
          }
        } else {
          this.value = Theme.DARK
        }
      }
      localStorage?.setItem(LOCAL_STORAGE_KEY, this.value)
      if (this.value === Theme.DARK) {
        document?.querySelector("html")?.classList.add(Theme.DARK)
      }
    },
    toggle() {
      this.value = this.value === Theme.DARK ? Theme.LIGHT : Theme.DARK
      document.querySelector("html")?.classList.toggle(Theme.DARK)
      localStorage?.setItem(LOCAL_STORAGE_KEY, this.value)
    },
  },
})
