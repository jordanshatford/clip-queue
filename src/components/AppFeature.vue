<template>
  <div class="flex flex-row space-x-4">
    <div
      class="flex aspect-square h-12 items-center justify-center rounded-xl bg-brand-500 text-white"
    >
      <component :is="icon" class="h-8 w-8" />
    </div>
    <div class="flex flex-col">
      <p class="cq-text text-lg font-semibold">{{ title }}</p>
      <p class="cq-text-subtle mt-1 text-base">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface Props {
  title: string
  description: string
  icon: Component
}

defineProps<Props>()
</script>
