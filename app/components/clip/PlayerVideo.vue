<template>
  <div class="video-container h-full w-full">
    <video
      ref="videoElement"
      class="video-js vjs-default-skin vjs-big-play-centered"
      :title="title"
    ></video>
  </div>
</template>

<script setup lang="ts">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export interface Props {
  src: string
  poster?: string
  title?: string
  start?: number
}

const { src, poster = undefined, title = undefined, start = undefined } = defineProps<Props>()

const videoElement = useTemplateRef<HTMLVideoElement>('videoElement')

// TODO(jordan): fix typing once video.js is updated.
// ref: https://github.com/videojs/video.js/issues/8242
let player: ReturnType<typeof videojs> | undefined

onMounted(async () => {
  await nextTick()

  if (!videoElement.value) return

  player = videojs(videoElement.value, {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    fill: true,
    poster,
    sources: [{ src }],
  })

  player.ready(() => {
    if (start) {
      player?.currentTime(start)
    }
  })
})

onBeforeUnmount(() => {
  player?.dispose()
})
</script>

<style>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-js {
  width: 100% !important;
  height: 100% !important;
  position: relative;
}

.video-js .vjs-tech {
  width: 100%;
  height: 100%;
}

.video-js .vjs-poster {
  width: 100%;
  height: 100%;
}

.video-js.vjs-fluid {
  padding-top: 0 !important;
}

.video-js .vjs-control-bar {
  box-sizing: border-box;
}
</style>
