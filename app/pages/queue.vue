<template>
  <div class="flex flex-col">
    <ClipPlayer
      v-if="queue.current && queue.current.id"
      :key="useClip(queue.current).uuid"
      :clip="queue.current"
      :previous-disabled="queue.history.length === 0"
      @previous="queue.previous()"
      @next="queue.next()"
    />
    <ClipQueue
      :title="m.upcoming_clips()"
      :clips="queue.upcoming.items"
      :is-open="queue.settings.open"
      @open="queue.open()"
      @close="queue.close()"
      @remove="queue.remove"
      @play="queue.play"
      @clear="queue.clear()"
    />
  </div>
</template>

<script setup lang="ts">
import { m } from '#paraglide/messages'

definePageMeta({
  requiresAuth: true,
  icon: 'lucide:list',
  order: 1,
})

const queue = useQueue()
</script>
