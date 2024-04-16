<template>
  <button
    class="flex items-center p-2 text-surface-500 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-700"
    @click="() => theme.toggle()"
  >
    <i :class="['text-xl', 'pi', theme.isDark ? 'pi-sun' : 'pi-moon']"></i>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/stores/theme'

const theme = useTheme()
</script>
