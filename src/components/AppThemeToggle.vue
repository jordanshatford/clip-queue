<template>
  <button
    @click="() => theme.toggle()"
    class="text-zinc-500 dark:text-zinc-200 hover:text-violet-500 dark:hover:text-violet-500 p-2"
  >
    <component :is="ThemeIcon" class="w-7" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline"
import { useTheme } from "@/stores/theme"

const theme = useTheme()

const ThemeIcon = computed(() => {
  return theme.isDark ? SunIcon : MoonIcon
})
</script>
