<template>
  <div class="player player-container h-auto w-full bg-black">
    <iframe
      v-if="format === 'iframe'"
      :src="source"
      :title
      class="player h-auto w-full bg-black"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      frameborder="0"
    ></iframe>
    <div v-else-if="format === 'video'" class="player">
      <VideoJS :poster="thumbnailUrl" :source :title autoplay />
    </div>
    <div
      v-else
      class="text-surface-600 dark:text-surface-400 flex h-full items-center justify-center font-normal"
    >
      <slot name="unsupported"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoJS from './VideoJSPlayer.vue'

export interface Props {
  format?: 'iframe' | 'video' | 'unknown'
  title?: string
  source?: string
  thumbnailUrl?: string
}

const {
  format = 'unknown',
  title = undefined,
  source = undefined,
  thumbnailUrl = undefined
} = defineProps<Props>()
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
