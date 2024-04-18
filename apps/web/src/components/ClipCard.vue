<template>
  <Card class="max-w-[16rem] flex-shrink-0 overflow-hidden text-left">
    <template #header>
      <div class="relative">
        <img
          class="aspect-video w-full"
          :alt="clip.title"
          :src="clip.thumbnailUrl"
          @error="emit('remove')"
        />
        <div class="absolute -bottom-6 -right-2 m-2 p-2">
          <div class="flex gap-2">
            <Button
              icon="pi pi-play"
              title="Play now"
              severity="info"
              size="small"
              @click="emit('play')"
            >
            </Button>
            <Button
              icon="pi pi-trash"
              title="Remove"
              severity="danger"
              size="small"
              @click="emit('remove')"
            >
            </Button>
          </div>
        </div>
      </div>
    </template>
    <template #title>
      <span class="font-normal">{{ clip.title }}</span>
    </template>
    <template #subtitle>
      <div class="text-xs text-surface-400">
        <p v-if="clip.category">{{ clip.channel }} - {{ clip.category }}</p>
        <p v-else>
          {{ clip.channel }}
        </p>
      </div>
    </template>
    <template #content>
      <div class="text-xs text-surface-400">Submitter: {{ clip.submitters[0] }}</div>
      <ProviderName :provider="clip.provider" class="pt-2 font-normal" />
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
