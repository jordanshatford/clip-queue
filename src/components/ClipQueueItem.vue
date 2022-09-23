<template>
  <div class="cq-card max-w-[16rem] overflow-hidden">
    <div
      class="flex items-end justify-end h-36 w-full bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <BaseButton class="pb-2 mr-2 -mb-2" @click="emit('play')">
        <BarsArrowUpIcon class="w-6" />
      </BaseButton>
      <BaseButton variant="danger" class="pb-2 mr-2 -mb-2" @click="emit('remove')">
        <TrashIcon class="w-6" />
      </BaseButton>
    </div>
    <div class="p-3">
      <span class="cq-text mt-2">{{ clip.title }}</span>
      <h3 class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.game }}
      </h3>
      <div class="mt-1 cq-text-subtle">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitter }}</span>
      </div>
      <div class="mt-1 cq-text-subtle">
        Source: <span class="cq-text-subtle-semibold">{{ clip.source ?? ClipSource.Unknown }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarsArrowUpIcon, TrashIcon } from "@heroicons/vue/24/outline"
import { ClipSource, type Clip } from "@/interfaces/clips"

export interface Props {
  clip: Clip
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "play"): void
  (e: "remove"): void
}>()
</script>
