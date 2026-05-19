<template>
  <div>
    <img v-if="!isLoading && !error" class="aspect-video rounded-md" :src :alt />
    <div v-else class="align-center flex aspect-video items-center justify-center rounded-md">
      <UIcon name="lucide:image" class="size-6" />
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
