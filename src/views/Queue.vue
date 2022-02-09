<template>
  <twitch-clip-player
    v-if="clips.queue.current && clips.queue.current.id"
    :clip="clips.queue.current"
    :previous-disabled="clips.queue.history.empty()"
    :next-disabled="clips.queue.upcoming.empty()"
    @previous="clips.previous()"
    @next="clips.next()"
  />
  <div v-else class="text-center">
    <p class="cq-title">Queue Open</p>
    <p class="cq-text">Start sending clips now for them to be added to the queue.</p>
    <v-button variant="brand" :disabled="clips.queue.upcoming.empty()" @click="clips.next()" class="my-5">
      Start Viewing!
    </v-button>
  </div>
  <clip-queue
    title="Queued Clips"
    :clips="clips.queue.upcoming.toArray()"
    :is-open="clips.queue.open"
    :percent-complete="queueProgress"
    @open="clips.open()"
    @close="clips.close()"
    @remove="clips.removeClip"
    @play="clips.playNow"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import TwitchClipPlayer from "@/components/TwitchClipPlayer.vue"
import { clips } from "@/stores/clips"
import ClipQueue from "@/components/queue/ClipQueue.vue"

const queueProgress = computed<number>(() => {
  const currentClip = clips.queue?.current?.id ? 1 : 0
  const allClips = clips.queue.history.size() + clips.queue.upcoming.size() + currentClip
  const clipsLeft = clips.queue.upcoming.size()
  const progress = 100 - Math.round((clipsLeft / allClips) * 100)
  return isNaN(progress) ? 0 : progress
})
</script>
