<template>
  <div class="flex items-center">
    <ClipThumbnail class="hidden w-24 sm:block" :src="data.thumbnailUrl" :alt="data.title" />
    <div class="text-left text-sm sm:ml-3">
      <span class="text-default">{{ data.title }}</span>
      <div class="text-xs">
        <p>{{ extras.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

export interface Props {
  data: Clip
}

const { data } = defineProps<Props>()

const extras = useClip(data)
</script>
