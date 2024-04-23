<template>
  <ClipPlayer
    v-if="queue.current && queue.current.id"
    :key="toUUID(queue.current)"
    :clip="queue.current"
    :previous-disabled="queue.history.empty()"
    :next-disabled="queue.upcoming.empty()"
    @previous="queue.previous()"
    @next="queue.next()"
  />
  <Message v-else-if="settings.queue.providers.length === 0" severity="error">
    No clip providers enabled. Please enable one in the settings.
  </Message>
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
import { toUUID } from '@cq/providers'
import { Message } from '@cq/ui'

import ClipPlayer from '@/components/ClipPlayer.vue'
import ClipQueue from '@/components/ClipQueue.vue'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

const queue = useQueue()
const settings = useSettings()
</script>
