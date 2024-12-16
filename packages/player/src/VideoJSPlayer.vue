<template>
  <video
    ref="videoElement"
    :title="title"
    class="video-js vjs-default-skin vjs-big-play-centered"
  ></video>
</template>

<script setup lang="ts">
import videojs from 'video.js'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

import 'video.js/dist/video-js.css'

export interface Props {
  poster: string | undefined
  source: string | undefined
  autoplay?: boolean
  title?: string
}

const { poster, source, autoplay = true, title = undefined } = defineProps<Props>()

const videoElement = useTemplateRef('videoElement')

// TODO: fix typing once video.js is updated.
// ref: https://github.com/videojs/video.js/issues/8242
let player: ReturnType<typeof videojs> | undefined = undefined

onMounted(() => {
  if (videoElement.value) {
    player = videojs(
      videoElement.value,
      // https://videojs.com/guides/options/
      {
        autoplay,
        title,
        controls: true,
        fluid: true,
        poster,
        sources: [source]
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
