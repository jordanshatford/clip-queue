<template>
  <div class="cq-card max-w-[16rem] overflow-hidden">
    <div
      class="flex items-end justify-end h-36 w-full bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <v-button class="pb-1 mr-2 -mb-2" @click="emit('play')">
        <v-icon icon="play" class="w-4 h-4" />
      </v-button>
      <v-button variant="danger" class="pb-1 mr-2 -mb-2" @click="emit('remove')">
        <v-icon icon="trash" class="w-4 h-4" />
      </v-button>
    </div>
    <div class="px-5 py-3">
      <span class="cq-text mt-2">{{ clip.title }}</span>
      <h3 class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.game }}
      </h3>
      <span class="mt-2 cq-text-subtle">
        Submitted by: <span class="cq-text-subtle-semibold">{{ clip.submitter }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
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
