<template>
  <Card class="max-w-[16rem] shrink-0 overflow-hidden text-left">
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
    <template #subtitle>
      <p v-if="clip.category">{{ clip.channel }} - {{ clip.category }}</p>
      <p v-else>
        {{ clip.channel }}
      </p>
    </template>
    <template #content>
      <div class="text-surface-400 mb-4 text-xs">
        <p>{{ m.submitter_name({ name: clip.submitters[0] }) }}</p>
        <p>{{ m.creator_name({ name: clip.creator ?? m.unknown() }) }}</p>
        <div class="flex items-center gap-1">
          <p>{{ m.provider_colon() }}</p>
          <ProviderName :provider="clip.provider" class="font-normal" />
        </div>
      </div>
      <div class="flex justify-between gap-3">
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
import type { Clip } from '@cq/providers'
import { Card, DangerButton, SecondaryButton } from '@cq/ui'

import ProviderName from '@/components/ProviderName.vue'
import * as m from '@/paraglide/messages'

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
