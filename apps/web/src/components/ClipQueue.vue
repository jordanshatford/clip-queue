<template>
  <div class="mx-0 mt-4">
    <div class="mb-2 mt-1 w-full border-t border-surface-300 dark:border-surface-700"></div>
    <div class="float-right">
      <BButton
        severity="info"
        size="small"
        :disabled="clips.length === 0"
        class="ml-2"
        @click="emit('clear')"
        >Clear</BButton
      >
      <BButton
        :severity="isOpen ? 'danger' : 'info'"
        size="small"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
        {{ isOpen ? 'Close' : 'Open' }}
      </BButton>
    </div>
    <div class="text-left">
      <p class="cq-text text-lg">{{ title }}</p>
      <span class="cq-text-subtle mt-3">
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
