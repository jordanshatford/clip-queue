<template>
  <div class="mx-0 mt-4">
    <USeparator size="sm" class="mb-4" />
    <div class="float-right">
      <UButton
        :disabled="clips.length === 0"
        class="ml-2"
        variant="soft"
        color="neutral"
        @click="emit('clear')"
      >
        {{ m.clear() }}
      </UButton>
      <UButton
        :variant="isOpen ? 'solid' : 'soft'"
        :color="isOpen ? 'error' : 'neutral'"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
        {{ isOpen ? m.close() : m.open() }}
      </UButton>
    </div>
    <div class="text-left">
      <p class="text-lg font-normal">
        {{ title }}
      </p>
      <span class="mt-3 text-sm font-normal">
        {{ m.clips({ length: clips.length }) }}
      </span>
    </div>
    <div class="flex items-stretch gap-2 overflow-x-auto px-1 py-3">
      <ClipCard
        v-for="clip in clips"
        :key="toClipUUID(clip)"
        :clip
        @play="emit('play', clip)"
        @remove="emit('remove', clip)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'
import ClipCard from '~/components/ClipCard.vue'
import { toClipUUID } from '~/integrations'

export interface Props {
  title?: string
  clips: Clip[]
  isOpen?: boolean
}

const { title = 'Queue', isOpen = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'play' | 'remove', value: Clip): void
  (e: 'open' | 'close' | 'clear'): void
}>()
</script>
