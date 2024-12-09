<template>
  <div class="mx-0 mt-4">
    <div class="mb-2 mt-1 w-full border-t border-surface-300 dark:border-surface-700"></div>
    <div class="float-right">
      <Button
        severity="info"
        :label="m.clear()"
        size="small"
        :disabled="clips.length === 0"
        class="ml-2"
        @click="emit('clear')"
      >
      </Button>
      <Button
        :severity="isOpen ? 'danger' : 'info'"
        :label="isOpen ? m.close() : m.open()"
        size="small"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
      </Button>
    </div>
    <div class="text-left">
      <p class="text-lg font-normal text-surface-600 dark:text-surface-400">{{ title }}</p>
      <span class="mt-3 text-sm font-normal text-surface-400 dark:text-surface-600">
        {{ m.clips({ length: clips.length }) }}
      </span>
    </div>
    <div class="flex justify-items-start overflow-x-auto px-1 py-3">
      <ClipCard
        v-for="clip in clips"
        :key="toUUID(clip)"
        :clip="clip"
        class="mr-2"
        @play="emit('play', clip)"
        @remove="emit('remove', clip)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '@cq/providers'
import { toUUID } from '@cq/providers'
import { Button } from '@cq/ui'

import ClipCard from '@/components/ClipCard.vue'
import * as m from '@/paraglide/messages'

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
