<template>
  <ClipPlayer
    v-if="queue.current && queue.current.id"
    :key="toClipUUID(queue.current)"
    :clip="queue.current"
    :previous-disabled="queue.history.empty()"
    @previous="queue.previous()"
    @next="queue.next()"
  />
  <ClipQueue
    :title="m.upcoming_clips()"
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
import { toClipUUID } from '@/integrations'
import { m } from '@/paraglide/messages'
import { useQueue } from '@/stores/queue'

const queue = useQueue()
</script>
