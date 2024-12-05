<template>
  <Card class="p-2">
    <template #title>
      <div class="flex gap-2">
        <i :class="['text-lg text-primary-500 dark:text-primary-400', icon]"></i>
        <span> {{ title }}</span>
      </div>
    </template>
    <template #content>
      <p class="text-sm text-surface-400">{{ description }}</p>
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
