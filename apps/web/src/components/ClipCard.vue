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
      <div class="text-surface-400 text-xs">
        <p class="line-clamp-1">{{ m.submitter_name({ name: clip.submitters[0] }) }}</p>
        <p class="line-clamp-1">{{ m.creator_name({ name: clip.creator ?? m.unknown() }) }}</p>
        <div class="flex items-center gap-1">
          <p>{{ m.provider_colon() }}</p>
          <ProviderName :provider="clip.provider" class="font-normal" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between gap-2">
        <SecondaryButton
          class="grow"
          icon="pi pi-play"
          :label="m.play()"
          size="small"
          @click="emit('play')"
        >
        </SecondaryButton>
        <DangerButton
          class="grow"
          icon="pi pi-trash"
          :label="m.remove()"
          size="small"
          @click="emit('remove')"
        >
        </DangerButton>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Clip } from '@cq/providers'
import { Card, DangerButton, SecondaryButton } from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'
import * as m from '@/paraglide/messages'

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
