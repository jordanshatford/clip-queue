<template>
  <div class="flex w-full items-center justify-between rounded-md py-1 text-left transition">
    <UButton
      class="group flex min-w-0 items-center gap-3 text-left"
      color="neutral"
      variant="ghost"
      @click="emit('play')"
    >
      <div class="relative h-14 w-24">
        <ClipThumbnail :src="clip.thumbnailUrl" :alt="clip.title" class="w-full object-cover" />
        <div
          class="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <UIcon name="lucide:play" class="text-white" />
        </div>
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">
          {{ clip.title }}
        </p>
        <p class="truncate text-xs text-muted">{{ extras.subtitle }}</p>
        <p class="truncate text-xs text-muted">
          {{ m.submitter_name({ name: extras.submitter }) }}
          <UBadge v-if="extras.count" size="xs" color="neutral" variant="soft">
            {{ extras.count }}
          </UBadge>
        </p>
      </div>
    </UButton>
    <UDropdownMenu :items="items" size="sm">
      <UButton
        class="shrink-0"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="lucide:ellipsis-vertical"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props {
  clip: Clip
}

const { clip } = defineProps<Props>()

const extras = useClip(clip)

const emit = defineEmits<{
  (e: 'play' | 'remove'): void
}>()

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: m.play(),
      icon: 'lucide:play',
      onSelect: () => {
        emit('play')
      },
    },
    {
      label: m.remove(),
      color: 'error',
      icon: 'lucide:trash',
      onSelect: () => {
        emit('remove')
      },
    },
  ],
  [
    {
      label: m.submitters(),
      icon: 'lucide:users',
      filter: true,
      children: extras.value.submitters,
    },
  ],
])
</script>
