<template>
  <button
    @click="() => theme.toggle()"
    class="text-2xl border-none focus:outline-none p-2 hover:text-violet-500 dark:hover:text-violet-500 text-zinc-500 dark:text-zinc-200 dark:bg-zinc-800"
  >
    <v-icon v-if="theme.isDark" icon="sun" />
    <v-icon v-else :icon="['far', 'moon']" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "@/stores/theme"

const theme = useTheme()
</script>
