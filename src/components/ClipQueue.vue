<template>
  <div class="mx-0 mt-2">
    <div class="mb-2 mt-1 w-full border-t border-zinc-300 dark:border-zinc-700"></div>
    <div class="float-right">
      <BaseButton
        variant="primary"
        :disabled="clips.length === 0"
        class="ml-2"
        @click="emit('clear')"
        >Clear</BaseButton
      >
      <BaseButton
        :variant="isOpen ? 'danger' : 'primary'"
        class="ml-2"
        @click="isOpen ? emit('close') : emit('open')"
      >
        {{ isOpen ? 'Close' : 'Open' }}
      </BaseButton>
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
        :key="clip.provider + ':' + clip.id"
        :clip="clip"
        inQueue
        @play="emit('play', clip)"
        @remove="emit('remove', clip)"
        class="mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ClipCard from '@/components/ClipCard.vue'
import type { Clip } from '@/providers'

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
