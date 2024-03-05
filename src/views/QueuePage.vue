<template>
  <ClipPlayer
    v-if="queue.current && queue.current.id"
    :clip="queue.current"
    :previous-disabled="queue.history.empty()"
    :next-disabled="queue.upcoming.empty()"
    @previous="queue.previous()"
    @next="queue.next()"
  />
  <div v-else class="text-center">
    <p class="cq-title">Queue {{ queue.isOpen ? 'Open' : 'Closed' }}</p>
    <p v-if="queue.isOpen" class="cq-text">
      Start sending clips now for them to be added to the queue.
    </p>
    <p v-else class="cq-text">Open the queue to start collecting clips sent in chat.</p>
    <BButton :disabled="queue.upcoming.empty()" size="small" @click="queue.next()" class="my-5">
      Start Viewing!
    </BButton>
  </div>
  <ClipQueue
    title="Upcoming Clips"
    :clips="queue.upcoming.toArray()"
    :is-open="queue.isOpen"
    @open="queue.open()"
    @close="queue.close()"
    @remove="queue.remove"
    @play="queue.play"
    @clear="queue.clear()"
  />
</template>

<script setup lang="ts">
import ClipPlayer from '@/components/ClipPlayer.vue'
import ClipQueue from '@/components/ClipQueue.vue'
import { useQueue } from '@/stores/queue'

const queue = useQueue()
</script>
