<template>
  <button
    @click="() => theme.toggle()"
    class="text-2xl border-none focus:outline-none p-2 hover:text-violet-500 dark:hover:text-violet-500 text-zinc-500 dark:text-zinc-200 dark:bg-zinc-800"
  >
    <SunIcon v-if="theme.isDark" class="w-7" />
    <MoonIcon v-else class="w-7" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline"
import { useTheme } from "@/stores/theme"

const theme = useTheme()
</script>
