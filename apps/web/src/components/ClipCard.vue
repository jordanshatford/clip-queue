<template>
  <Card class="max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <template #header>
      <img
        class="aspect-video w-full"
        :alt="clip.title"
        :src="clip.thumbnailUrl"
        @error="emit('remove')"
      />
    </template>
    <template #title>
      <span class="font-normal">{{ clip.title }}</span>
    </template>
    <template #subtitle> </template>
    <template #content>
      <div class="mb-4 text-xs text-surface-400">
        <p v-if="clip.category">{{ clip.channel }} - {{ clip.category }}</p>
        <p v-else>
          {{ clip.channel }}
        </p>
        <p>Submitter: {{ clip.submitters[0] }}</p>
        <div class="flex items-center gap-1">
          <p>Provider:</p>
          <ProviderName :provider="clip.provider" class="font-normal" />
        </div>
      </div>
      <div class="flex justify-around gap-2">
        <Button
          icon="pi pi-play"
          title="Play"
          label="Play"
          severity="info"
          size="small"
          @click="emit('play')"
        >
        </Button>
        <Button
          icon="pi pi-trash"
          title="Remove"
          label="Remove"
          severity="danger"
          size="small"
          @click="emit('remove')"
        >
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { Clip } from '@cq/providers'
import { Button, Card } from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'

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
