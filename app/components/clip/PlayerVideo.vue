<template>
  <div class="video-container h-full w-full">
    <video-player :poster="poster" :content-title="title">
      <video-skin>
        <hlsjs-video v-if="isHls" :src="src" autoplay playsinline @loadedmetadata="seekToStart" />
        <video v-else :src="src" autoplay playsinline @loadedmetadata="seekToStart">
          <a href="https://videojs.org/help">Video player not working?</a>
        </video>
      </video-skin>
    </video-player>
  </div>
</template>

<script setup lang="ts">
import type { HlsJsVideoElement } from '@videojs/html/media/hlsjs-video'

import '@videojs/html/video/player'
import '@videojs/html/video/skin'
import '@videojs/html/media/hlsjs-video'

export interface Props {
  src: string
  poster?: string
  title?: string
  start?: number
}

const { src, poster = undefined, title = undefined, start = undefined } = defineProps<Props>()

const isHls = computed(() => src.split(/[?#]/, 1)[0]?.toLowerCase().endsWith('.m3u8'))

function seekToStart(event: Event): void {
  if (start === undefined || start <= 0) return
  const media = event.currentTarget as HTMLVideoElement | HlsJsVideoElement
  media.currentTime = start
}
</script>

<style>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

video-skin {
  --media-border-radius: var(--ui-radius);
  display: block;
  width: 100%;
  height: 100%;
}
</style>
