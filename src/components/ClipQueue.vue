<template>
  <div class="mx-0 mt-4">
    <div class="mt-1 mb-2 w-full border-t border-surface-300 dark:border-surface-700"></div>
    <div class="float-right">
      <Button
        :label="m.clear()"
        size="small"
        :disabled="clips.length === 0"
        class="ml-2"
        severity="secondary"
        @click="emit('clear')"
      >
      </Button>
      <Button
        :severity="isOpen ? 'danger' : 'secondary'"
        :label="isOpen ? m.close() : m.open()"
        size="small"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
      </Button>
    </div>
    <div class="text-left">
      <p class="text-lg font-normal text-surface-600 dark:text-surface-400">
        {{ title }}
      </p>
      <span class="mt-3 text-sm font-normal text-surface-400 dark:text-surface-600">
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
import Button from 'primevue/button'

import type { Clip } from '@/providers'

import ClipCard from '@/components/ClipCard.vue'
import { m } from '@/paraglide/messages'
import { toClipUUID } from '@/providers'

export interface Props {
  title?: string
  clips: Clip[]
  isOpen?: boolean
}

const { title = 'Queue', isOpen = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'play', value: Clip): void
  (e: 'remove', value: Clip): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'clear'): void
}>()
</script>
