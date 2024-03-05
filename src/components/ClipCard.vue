<template>
  <div class="cq-card max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <div
      class="flex h-36 w-full items-end justify-end bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <BButton
        title="Play now"
        severity="info"
        size="small"
        class="-mb-2 mr-2 pb-2"
        @click="emit('play')"
      >
        <i class="pi pi-play p-1"></i>
      </BButton>
      <BButton
        title="Remove"
        severity="danger"
        size="small"
        class="-mb-2 mr-2 pb-2"
        @click="emit('remove')"
      >
        <i class="pi pi-trash p-1"></i>
      </BButton>
    </div>
    <div class="p-3">
      <span class="cq-text mt-2">{{ clip.title }}</span>
      <h3 class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.category }}
      </h3>
      <div class="cq-text-subtle mt-1">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitters[0] }}</span>
      </div>
      <div class="cq-text-subtle mt-1">
        Provider:
        <span class="cq-text-subtle-semibold">{{ clip.provider }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '@/providers'

export interface Props {
  clip: Clip
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
