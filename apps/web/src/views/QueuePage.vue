<template>
  <ClipPlayer
    v-if="queue.current && queue.current.id"
    :key="toClipUUID(queue.current)"
    :clip="queue.current"
    :previous-disabled="queue.history.empty()"
    @previous="queue.previous()"
    @next="queue.next()"
  />
  <Message v-else-if="settings.queue.providers.length === 0" severity="error">
    <template #icon>
      <i class="pi pi-exclamation-circle"></i>
    </template>
    <span>{{ m.message_no_clip_providers_enabled() }}</span>
  </Message>
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
import { toClipUUID } from '@cq/providers'
import { Message } from '@cq/ui'

import ClipPlayer from '@/components/ClipPlayer.vue'
import ClipQueue from '@/components/ClipQueue.vue'
import * as m from '@/paraglide/messages'
import { useQueue } from '@/stores/queue'
import { useSettings } from '@/stores/settings'

const queue = useQueue()
const settings = useSettings()
</script>
