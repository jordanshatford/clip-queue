<template>
  <div class="grid h-full grid-cols-1 gap-2 lg:grid-cols-[1fr_300px]">
    <ClipPlayer
      :key="queue.current?.id"
      :clip="queue.current"
      :previous-disabled="queue.history.length === 0"
      @previous="queue.previous()"
      @next="queue.next()"
    />
    <ClipQueue
      :title="m.upcoming_clips()"
      :clips="queue.upcoming.items"
      :display="queue.upcoming.display"
      :is-open="queue.settings.open"
      @open="queue.open()"
      @close="queue.close()"
      @remove="(c) => queue.remove(c, true)"
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
