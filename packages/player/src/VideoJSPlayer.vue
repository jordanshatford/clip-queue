<template>
  <video
    ref="videoElement"
    :title="title"
    class="video-js vjs-default-skin vjs-big-play-centered"
  ></video>
</template>

<script setup lang="ts">
import videojs from 'video.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import 'video.js/dist/video-js.css'

export interface Props {
  poster: string | undefined
  source: string | undefined
  autoplay?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  title: undefined
})

const videoElement = ref<HTMLVideoElement | null>(null)

// TODO: fix typing once video.js is updated.
// ref: https://github.com/videojs/video.js/issues/8242
let player: any | undefined = undefined

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
