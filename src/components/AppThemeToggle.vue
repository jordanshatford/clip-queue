<template>
  <button
    @click="() => theme.toggle()"
    class="p-2 text-zinc-500 hover:text-brand-500 dark:text-zinc-200 dark:hover:text-brand-500"
  >
    <component :is="ThemeIcon" class="w-7" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SunIcon, MoonIcon } from '@/assets/icons'
import { useTheme } from '@/stores/theme'

const theme = useTheme()

const ThemeIcon = computed(() => {
  return theme.isDark ? SunIcon : MoonIcon
})
</script>
