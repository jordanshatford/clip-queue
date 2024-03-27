<template>
  <div class="player player-container h-auto w-full bg-black">
    <iframe
      v-if="format === 'iframe'"
      :src="source"
      :title="title"
      class="player h-auto w-full bg-black"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      frameborder="0"
    ></iframe>
    <VideoJS
      v-else-if="format === 'video'"
      :poster="thumbnailUrl"
      :source="source"
      :title="title"
      autoplay
    />
    <div v-else class="cq-text flex h-full items-center justify-center">
      <p>Unsupported clip. You may need to enable the provider of this clip.</p>
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

withDefaults(defineProps<Props>(), {
  format: 'unknown',
  title: undefined,
  source: undefined,
  thumbnailUrl: undefined
})
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
