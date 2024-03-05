<template>
  <button
    @click="() => theme.toggle()"
    class="p-2 text-zinc-500 hover:text-brand-500 dark:text-zinc-200 dark:hover:text-brand-500"
  >
    <i :class="['text-xl', 'pi', theme.isDark ? 'pi-sun' : 'pi-moon']"></i>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/stores/theme'

const theme = useTheme()
</script>
