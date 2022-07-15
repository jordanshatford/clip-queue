<template>
  <clip-player
    v-if="queue.current && queue.current.id"
    :clip="queue.current"
    :autoplay="true"
    :previous-disabled="queue.history.empty()"
    :next-disabled="queue.upcoming.empty()"
    @previous="queue.previous()"
    @next="queue.next()"
  ></clip-player>
  <div v-else class="text-center">
    <p class="cq-title">Queue Open</p>
    <p class="cq-text">Start sending clips now for them to be added to the queue.</p>
    <v-button variant="brand" :disabled="queue.upcoming.empty()" @click="queue.next()" class="my-5">
      Start Viewing!
    </v-button>
  </div>
  <clip-queue
    title="Upcoming Clips"
    :clips="queue.upcoming.toArray()"
    :is-open="queue.isOpen"
    @open="queue.open()"
    @close="queue.close()"
    @remove="queue.remove"
    @play="queue.play"
    @clear="queue.clear"
  ></clip-queue>
</template>

<script setup lang="ts">
import ClipPlayer from "@/components/ClipPlayer.vue"
import ClipQueue from "@/components/ClipQueue.vue"
import { useQueue } from "@/stores/queue"

const queue = useQueue()
</script>
