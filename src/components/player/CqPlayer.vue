<template>
  <div class="player player-container h-auto w-full bg-black">
    <iframe
      v-if="config?.type === 'iframe'"
      :src="config.src"
      :title="config.title"
      class="player h-auto w-full bg-black"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      frameborder="0"
    ></iframe>
    <div v-else-if="config?.type === 'video'" class="player">
      <VideoJS
        :poster="config.poster"
        :source="config.src"
        :title="config.title"
        autoplay
        :start="config.start"
      />
    </div>
    <div
      v-else
      class="flex h-full items-center justify-center font-normal text-surface-600 dark:text-surface-400"
    >
      <slot name="unsupported"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerConfig } from '@/integrations/core'

import VideoJS from './VideoJSPlayer.vue'

export interface Props {
  config?: PlayerConfig
}

const { config = undefined } = defineProps<Props>()
</script>

<style>
.player-container {
  grid-area: player;
}

.player {
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 11rem);
}
</style>
