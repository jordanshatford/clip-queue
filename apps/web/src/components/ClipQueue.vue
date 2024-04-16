<template>
  <div class="mx-0 mt-4">
    <div class="mb-2 mt-1 w-full border-t border-surface-300 dark:border-surface-700"></div>
    <div class="float-right">
      <Button
        severity="info"
        label="Clear"
        size="small"
        :disabled="clips.length === 0"
        class="ml-2"
        @click="emit('clear')"
      >
      </Button>
      <Button
        :severity="isOpen ? 'danger' : 'info'"
        :label="isOpen ? 'Close' : 'Open'"
        size="small"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
      </Button>
    </div>
    <div class="text-left">
      <p class="text-lg font-normal text-surface-600 dark:text-surface-400">{{ title }}</p>
      <span class="mt-3 text-sm font-normal text-surface-400 dark:text-surface-600">
        {{ clips.length }} {{ clips.length === 1 ? 'clip' : 'clips' }}
      </span>
    </div>
    <div class="mt-3 flex justify-items-start overflow-x-auto">
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
import { type Clip, toUUID } from '@cq/providers'
import { Button } from '@cq/ui'
import ClipCard from '@/components/ClipCard.vue'

export interface Props {
  title?: string
  clips: Clip[]
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Queue',
  isOpen: false
})

const emit = defineEmits<{
  (e: 'play', value: Clip): void
  (e: 'remove', value: Clip): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'clear'): void
}>()
</script>
