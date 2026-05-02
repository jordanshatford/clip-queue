<template>
  <div>
    <img v-if="!isLoading && !error" class="aspect-video rounded-md" :src :alt />
    <div
      v-else
      class="align-center flex aspect-video items-center justify-center rounded-md bg-surface-100 text-surface-400 dark:bg-surface-800 dark:text-surface-500"
    >
      <i class="pi pi-image block text-xl leading-none"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'

export interface Props {
  src: string
  alt: string
}

const { src, alt } = defineProps<Props>()

const { isLoading, error } = useImage({ src, alt })
</script>
