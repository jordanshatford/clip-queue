<template>
  <twitch-clip-player
    v-if="clips.current && clips.current.id"
    :clip="clips.current"
    :autoplay="true"
    :previous-disabled="clips.history.empty()"
    :next-disabled="clips.upcoming.empty()"
    @previous="clips.previous()"
    @next="clips.next()"
  />
  <div v-else class="text-center">
    <p class="cq-title">Queue Open</p>
    <p class="cq-text">Start sending clips now for them to be added to the queue.</p>
    <v-button variant="brand" :disabled="clips.upcoming.empty()" @click="clips.next()" class="my-5">
      Start Viewing!
    </v-button>
  </div>
  <clip-queue
    title="Queued Clips"
    :clips="clips.upcoming.toArray()"
    :is-open="clips.isOpen"
    :percent-complete="clips.queueProgress"
    @open="clips.open()"
    @close="clips.close()"
    @remove="clips.remove"
    @play="clips.play"
    @clear="clips.clear"
  />
</template>

<script setup lang="ts">
import TwitchClipPlayer from "@/components/TwitchClipPlayer.vue"
import { useClips } from "@/stores/clips"
import ClipQueue from "@/components/queue/ClipQueue.vue"

const clips = useClips()
</script>
