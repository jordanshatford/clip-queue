<template>
  <Card class="max-w-2xs shrink-0 overflow-hidden text-left">
    <template #header>
      <div class="relative">
        <ClipThumbnail :src="clip.thumbnailUrl" :alt="clip.title" />
        <div class="absolute top-2 right-2 rounded bg-black/50 p-1.5">
          <IntegrationIcon class="size-5" :id="clip.provider" />
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
          <Badge
            v-if="totalSubmitters"
            :value="totalSubmitters"
            severity="secondary"
            size="small"
          ></Badge>
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
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { computed } from 'vue'

import type { Clip } from '@/integrations'

import IntegrationIcon from '@/components/integrations/IntegrationIcon.vue'
import { m } from '@/paraglide/messages'

import ClipThumbnail from './ClipThumbnail.vue'

export interface Props {
  clip: Clip
}

const { clip } = defineProps<Props>()

const subtitle = computed(() => {
  if (clip.category) {
    return `${clip.channel} - ${clip.category}`
  }
  return clip.channel
})

const totalSubmitters = computed((): string | undefined => {
  if (clip.submitters.length < 2) {
    return undefined
  }
  return `${clip.submitters.length > 9999 ? '9999+' : clip.submitters.length}`
})

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
