<template>
  <Card class="max-w-2xs shrink-0 overflow-hidden text-left">
    <template #header>
      <img
        class="aspect-video w-full"
        :alt="clip.title"
        :src="clip.thumbnailUrl"
        @error="emit('remove')"
      />
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
        <p class="line-clamp-1">
          {{ m.creator_name({ name: clip.creator ?? m.unknown() }) }}
        </p>
        <div class="flex items-center gap-1">
          <p>{{ m.provider_colon() }}</p>
          <ProviderName :provider="clip.provider" class="font-normal" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-2">
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

import type { Clip } from '@/providers'

import { m } from '@/paraglide/messages'

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

const emit = defineEmits<{
  (e: 'play'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
