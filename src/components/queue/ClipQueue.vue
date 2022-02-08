<template>
  <div class="mx-0 mt-2">
    <v-progress-bar v-if="percentComplete" variant="brand" :value="percentComplete" />
    <div class="w-full mb-2 mt-1 border-t border-zinc-300 dark:border-zinc-700"></div>
    <v-button
      :variant="isOpen ? 'danger' : 'primary'"
      class="float-right"
      @click="isOpen ? emit('close') : emit('open')"
    >
      {{ isOpen ? "Close" : "Open" }} Queue
    </v-button>
    <h3 class="text-zinc-600 dark:text-zinc-400 text-lg">{{ title }}</h3>
    <span class="mt-3 text-sm text-zinc-400 dark:text-zinc-600">
      {{ clips.length }} {{ clips.length === 1 ? "clip" : "clips" }}
    </span>
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
      <clip-queue-item
        v-for="clip in clips"
        :key="clip.id"
        :clip="clip"
        @play="emit('play', clip)"
        @remove="emit('remove', clip)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from "vue"
import ClipQueueItem from "@/components/queue/ClipQueueItem.vue"
import type { Clip } from "@/interfaces/clips"

interface Props {
  title?: string
  clips: Clip[]
  isOpen?: boolean
  percentComplete?: number
}

withDefaults(defineProps<Props>(), {
  title: "Queue",
  isOpen: false,
  percentComplete: 0,
})

const emit = defineEmits<{
  (e: "play", value: Clip): void
  (e: "remove", value: Clip): void
  (e: "open"): void
  (e: "close"): void
}>()
</script>
