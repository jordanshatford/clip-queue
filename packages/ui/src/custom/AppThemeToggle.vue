<template>
  <Button
    :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
    size="small"
    text
    rounded
    aria-label="Theme"
    @click="() => emit('toggle')"
  ></Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

export interface Props {
  isDarkMode: boolean
}

withDefaults(defineProps<Props>(), { isDarkMode: false })

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>
