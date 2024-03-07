<template>
  <button
    @click="() => theme.toggle()"
    class="p-2 text-surface-500 hover:text-primary-500 dark:text-surface-200 dark:hover:text-primary-500"
  >
    <i :class="['text-xl', 'pi', theme.isDark ? 'pi-sun' : 'pi-moon']"></i>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/stores/theme'

const theme = useTheme()
</script>
