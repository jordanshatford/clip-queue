<template>
  <div class="flex flex-row space-x-4">
    <div
      class="flex aspect-square h-12 items-center justify-center rounded-xl bg-primary-700 text-white"
    >
      <i :class="['text-xl', icon]"></i>
    </div>
    <div class="flex flex-col">
      <p class="text-lg font-normal font-semibold text-surface-600 dark:text-surface-400">
        {{ title }}
      </p>
      <p class="mt-1 text-base text-sm font-normal text-surface-400 dark:text-surface-600">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
</script>
