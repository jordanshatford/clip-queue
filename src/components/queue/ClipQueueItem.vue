<template>
  <div class="bg-zinc-100 dark:bg-zinc-800 w-full max-w-sm mx-auto rounded-lg shadow-md overflow-hidden">
    <div
      class="flex items-end justify-end h-56 w-full bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <v-button class="pb-1 mr-3 -mb-2" @click="emit('play')">
        <v-icon icon="play" class="w-5 h-5" />
      </v-button>
      <v-button variant="danger" class="pb-1 mr-3 -mb-2" @click="emit('remove')">
        <v-icon icon="trash" class="w-5 h-5" />
      </v-button>
    </div>
    <div class="px-5 py-3 text-zinc-500">
      <span class="text-zinc-700 dark:text-zinc-400 mt-2">{{ clip.title }}</span>
      <h3 class="font-bold">{{ clip.channel }}<span class="font-normal"> playing </span>{{ clip.game }}</h3>
      <span class="mt-2"
        >Submitted by: <span class="font-bold">{{ clip.submitter }}</span></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue"
import type { Clip } from "@/interfaces/clips"

interface Props {
  clip: Clip
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "play"): void
  (e: "remove"): void
}>()
</script>
