<template>
  <CCard class="max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <template #header>
      <div class="relative">
        <img class="w-full" :alt="clip.title" :src="clip.thumbnailUrl" />
        <div class="absolute -bottom-6 -right-2 m-2 p-2">
          <div class="flex gap-2">
            <BButton title="Play now" severity="info" size="small" @click="emit('play')">
              <i class="pi pi-play p-1"></i>
            </BButton>
            <BButton title="Remove" severity="danger" size="small" @click="emit('remove')">
              <i class="pi pi-trash p-1"></i>
            </BButton>
          </div>
        </div>
      </div>
    </template>
    <template #title
      ><span class="cq-text">{{ clip.title }}</span></template
    >
    <template #subtitle>
      <div class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.category }}
      </div>
    </template>
    <template #content>
      <div class="cq-text-subtle">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitters[0] }}</span>
      </div>
      <div class="cq-text-subtle">
        Provider:
        <span class="cq-text-subtle-semibold">{{ clip.provider }}</span>
      </div>
    </template>
  </CCard>
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
