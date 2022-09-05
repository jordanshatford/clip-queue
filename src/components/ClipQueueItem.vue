<template>
  <div class="cq-card max-w-[16rem] overflow-hidden">
    <div
      class="flex items-end justify-end h-36 w-full bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <BaseButton class="pb-2 mr-2 -mb-2" @click="emit('play')">
        <bars-arrow-up-icon class="w-6"></bars-arrow-up-icon>
      </BaseButton>
      <BaseButton variant="danger" class="pb-2 mr-2 -mb-2" @click="emit('remove')">
        <trash-icon class="w-6"></trash-icon>
      </BaseButton>
    </div>
    <div class="p-3">
      <span class="cq-text mt-2">{{ clip.title }}</span>
      <h3 class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.game }}
      </h3>
      <span class="mt-2 cq-text-subtle">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitter }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarsArrowUpIcon, TrashIcon } from "@heroicons/vue/24/outline"
import type { Clip } from "@/interfaces/clips"

export interface Props {
  clip: Clip
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "play"): void
  (e: "remove"): void
}>()
</script>
