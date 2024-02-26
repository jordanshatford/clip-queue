<template>
  <video ref="videoElement" class="video-js vjs-default-skin vjs-big-play-centered"></video>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
// TODO: remove once types are fixed in video.js
//  ref: https://github.com/videojs/video.js/issues/8242
import Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

export interface Props {
  autoplay: boolean
  poster: string | undefined
  source: string | undefined
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true
})

const videoElement = ref<HTMLVideoElement | null>(null)

let player: Player | undefined = undefined

onMounted(() => {
  if (videoElement.value) {
    player = videojs(
      videoElement.value,
      // https://videojs.com/guides/options/
      {
        ...props,
        controls: true,
        fluid: true,
        poster: props.poster,
        sources: [props.source]
      },
      () => {}
    )
  }
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
  }
})
</script>
