<template>
  <UCard
    variant="subtle"
    class="max-w-2xs shrink-0 overflow-hidden text-left"
    :ui="{ header: 'p-0!' }"
  >
    <template #header>
      <div class="relative">
        <ClipThumbnail :src="clip.thumbnailUrl" :alt="clip.title" class="w-full object-cover" />
        <div
          class="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded bg-black/50 p-2"
        >
          <IntegrationIcon :id="clip.provider" class="size-5 text-white" />
        </div>
      </div>
    </template>
    <span :title="clip.title" class="line-clamp-1 font-normal">{{ clip.title }}</span>
    <span :title="extras.subtitle" class="line-clamp-1 text-sm">{{ extras.subtitle }}</span>
    <div class="text-xs">
      <p class="line-clamp-1">
        {{ m.submitter_name({ name: extras.submitter }) }}
        <UBadge v-if="extras.count" size="sm" color="neutral" variant="soft">
          {{ extras.count }}
        </UBadge>
      </p>
    </div>
    <template #footer>
      <div class="flex justify-between gap-2 pt-1">
        <UButton
          class="grow justify-center"
          icon="lucide:play"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="emit('play')"
          >{{ m.play() }}</UButton
        >
        <UButton
          class="grow justify-center"
          icon="lucide:trash"
          color="error"
          size="sm"
          @click="emit('remove')"
          >{{ m.remove() }}</UButton
        >
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props {
  clip: Clip
}

const { clip } = defineProps<Props>()

const extras = useClip(clip)

const emit = defineEmits<{
  (e: 'play' | 'remove' | 'add'): void
}>()
</script>
