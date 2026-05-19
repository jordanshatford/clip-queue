<template>
  <div class="flex items-center">
    <ClipThumbnail class="hidden w-24 sm:block" :src="data.thumbnailUrl" :alt="data.title" />
    <div class="text-left text-sm sm:ml-3">
      <p class="flex items-center gap-1 font-normal">
        {{ data.title }}
        <span v-if="data.url">
          <a :href="data.url" target="_blank" rel="noreferrer" class="no-underline">
            <UIcon name="lucide:external-link" />
          </a>
        </span>
      </p>
      <div class="text-xs">
        <p v-if="data.category">{{ data.channel }} - {{ data.category }}</p>
        <p v-else>
          {{ data.channel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '@/integrations'

import ClipThumbnail from '@/components/ClipThumbnail.vue'

export interface Props {
  data: Clip
}

const { data } = defineProps<Props>()
</script>
