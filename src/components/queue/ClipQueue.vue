<template>
  <div class="mx-0 mt-2">
    <v-progressbar v-if="percentComplete" variant="brand" :value="percentComplete" />
    <div class="w-full mb-2 mt-1 border-t border-zinc-300 dark:border-zinc-700"></div>
    <div class="float-right">
      <v-button variant="primary" :disabled="clips.length === 0" class="ml-2" @click="emit('clear')">Clear</v-button>
      <v-button :variant="isOpen ? 'danger' : 'primary'" class="ml-2" @click="isOpen ? emit('close') : emit('open')">
        {{ isOpen ? "Close" : "Open" }}
      </v-button>
    </div>
    <div class="text-left">
      <p class="cq-text text-lg">{{ title }}</p>
      <span class="mt-3 cq-text-subtle"> {{ clips.length }} {{ clips.length === 1 ? "clip" : "clips" }} </span>
    </div>
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
      <clip-queue-item
        v-for="clip in clips"
        :key="clip.id"
        :clip="clip"
        @play="emit('play', clip)"
        @remove="emit('remove', clip)"
        class="text-left"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  (e: "clear"): void
}>()
</script>
