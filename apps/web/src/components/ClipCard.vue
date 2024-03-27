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
            <Button title="Play now" severity="info" size="small" @click="emit('play')">
              <i class="pi pi-play p-1"></i>
            </Button>
            <Button title="Remove" severity="danger" size="small" @click="emit('remove')">
              <i class="pi pi-trash p-1"></i>
            </Button>
          </div>
        </div>
      </div>
    </template>
    <template #title
      ><span class="cq-text">{{ clip.title }}</span></template
    >
    <template #subtitle>
      <div v-if="clip.category" class="cq-text-subtle-semibold">
        {{ clip.channel }}<span class="cq-text-subtle"> playing </span>{{ clip.category }}
      </div>
      <div v-else class="cq-text-subtle-semibold">
        {{ clip.channel }}
      </div>
    </template>
    <template #content>
      <div class="cq-text-subtle mb-2">
        Submitter: <span class="cq-text-subtle-semibold">{{ clip.submitters[0] }}</span>
      </div>
      <ProviderName :provider="clip.provider" class="cq-text" />
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
