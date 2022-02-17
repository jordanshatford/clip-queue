<template>
  <button
    @click="() => theme.toggle()"
    class="text-2xl border-none focus:outline-none p-2 hover:text-violet-500 dark:hover:text-violet-500 text-zinc-500 dark:text-zinc-200 dark:bg-zinc-800"
  >
    <ph-sun v-if="theme.isDark" weight="bold" />
    <ph-moon v-else weight="bold" />
  </button>
</template>

<script setup lang="ts">
import { PhSun, PhMoon } from "phosphor-vue"
import { useTheme } from "@/stores/theme"

const theme = useTheme()
</script>
