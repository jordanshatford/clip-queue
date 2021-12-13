import { reactive } from "vue";

const state = reactive({
  theme: "dark",
});

function getDefault(): void {
  const theme = localStorage?.getItem("theme");
  if (theme) {
    state.theme = theme;
  } else {
    state.theme = "dark";
  }

  localStorage?.setItem("theme", state.theme);

  if (state.theme === "dark") {
    document?.querySelector("html")?.classList.add("dark");
  }
}

function toggle(): void {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.querySelector("html")?.classList.toggle("dark");
  localStorage?.setItem("theme", state.theme);
}

export const theme = {
  state,
  getDefault,
  toggle,
};
