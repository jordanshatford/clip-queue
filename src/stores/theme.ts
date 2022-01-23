import { reactive } from "vue";
import config from "@/assets/config";

const { localStorageKey, defaultValue } = config.App.Theme;

const state = reactive({
  theme: defaultValue,
});

function getDefault(): void {
  const theme = localStorage?.getItem(localStorageKey);
  if (theme) {
    state.theme = theme;
  } else {
    state.theme = defaultValue;
  }

  localStorage?.setItem(localStorageKey, state.theme);

  if (state.theme === "dark") {
    document?.querySelector("html")?.classList.add("dark");
  }
}

function toggle(): void {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.querySelector("html")?.classList.toggle("dark");
  localStorage?.setItem(localStorageKey, state.theme);
}

export const theme = {
  state,
  getDefault,
  toggle,
};
