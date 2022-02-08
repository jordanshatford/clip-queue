import { ref } from "vue"
import config from "@/assets/config"

const { localStorageKey, defaultValue } = config.App.Theme

const current = ref(defaultValue)

function getDefault(): void {
  const theme = localStorage?.getItem(localStorageKey)
  if (theme) {
    current.value = theme
  } else {
    current.value = defaultValue
  }

  localStorage?.setItem(localStorageKey, current.value)

  if (current.value === "dark") {
    document?.querySelector("html")?.classList.add("dark")
  }
}

function toggle(): void {
  current.value = current.value === "dark" ? "light" : "dark"
  document.querySelector("html")?.classList.toggle("dark")
  localStorage?.setItem(localStorageKey, current.value)
}

export const theme = {
  current,
  getDefault,
  toggle,
}
