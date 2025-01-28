<template>
  <Card class="p-2">
    <template #title>
      <div class="flex gap-2">
        <i :class="['text-primary-500 dark:text-primary-400 text-lg', icon]"></i>
        <span> {{ title }}</span>
      </div>
    </template>
    <template #content>
      <p class="text-surface-400 text-sm">{{ description }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

export interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
</script>
