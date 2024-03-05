<template>
  <div class="flex flex-row space-x-4">
    <div
      class="flex aspect-square h-12 items-center justify-center rounded-xl bg-brand-500 text-white"
    >
      <i :class="['text-xl', icon]"></i>
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
export interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
</script>
