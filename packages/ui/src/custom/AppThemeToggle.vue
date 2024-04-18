<template>
  <button
    class="flex items-center p-2 text-surface-500 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-700"
    @click="() => emit('toggle')"
  >
    <i :class="['text-xl', 'pi', isDarkMode ? 'pi-sun' : 'pi-moon']"></i>
  </button>
</template>

<script setup lang="ts">
export interface Props {
  isDarkMode: boolean
}

withDefaults(defineProps<Props>(), { isDarkMode: false })

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>
