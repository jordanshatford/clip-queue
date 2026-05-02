<template>
  <Card class="max-w-2xs shrink-0 overflow-hidden text-left">
    <template #header>
      <div class="relative">
        <img class="aspect-video w-full" :alt="clip.title" :src="clip.thumbnailUrl" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="svg" class="absolute top-2 right-2 rounded bg-black/50 p-1.5">
          <svg class="size-5" v-html="svg"></svg>
        </div>
      </div>
    </template>
    <template #title>
      <span :title="clip.title" class="line-clamp-1 font-normal">{{ clip.title }}</span>
    </template>
    <template #subtitle>
      <span :title="subtitle" class="line-clamp-1">{{ subtitle }}</span>
    </template>
    <template #content>
      <div class="text-xs text-surface-400">
        <p class="line-clamp-1">
          {{ m.submitter_name({ name: clip.submitters[0] ?? '' }) }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-2 pt-1">
        <Button
          class="grow"
          icon="pi pi-play"
          :label="m.play()"
          size="small"
          severity="secondary"
          @click="emit('play')"
        >
        </Button>
        <Button
          class="grow"
          icon="pi pi-trash"
          :label="m.remove()"
          size="small"
          severity="danger"
          @click="emit('remove')"
        >
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed } from 'vue'

import type { Clip } from '@/integrations'

import { m } from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'

export interface Props {
  clip: Clip
}

const { clip } = defineProps<Props>()

const providers = useProviders()

const subtitle = computed(() => {
  if (clip.category) {
    return `${clip.channel} - ${clip.category}`
  }
  return clip.channel
})

const svg = computed(() => providers.icon(clip.provider))

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
