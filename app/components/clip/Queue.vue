<template>
  <aside class="bg-background flex min-h-0 flex-col">
    <div class="flex items-center justify-between gap-2 px-1 pb-1">
      <div class="flex min-w-0 gap-1 text-sm font-semibold">
        <UTooltip :text="title">
          <span class="truncate">{{ title }}</span>
        </UTooltip>
        <UBadge size="sm" variant="outline" color="neutral">{{ display }}</UBadge>
      </div>
      <div class="flex items-center gap-1">
        <UButton
          size="xs"
          color="neutral"
          variant="outline"
          :disabled="clips.length === 0"
          @click="emit('clear')"
        >
          {{ m.clear() }}
        </UButton>
        <UButton
          size="xs"
          variant="subtle"
          :color="isOpen ? 'error' : 'neutral'"
          @click="isOpen ? emit('close') : emit('open')"
        >
          {{ isOpen ? m.close() : m.open() }}
        </UButton>
      </div>
    </div>
    <UEmpty
      v-if="clips.length === 0"
      variant="naked"
      :title="m.no_clips_upcoming()"
      :description="m.no_clips_upcoming_description()"
    />
    <UScrollArea v-else v-slot="{ item }" :items="clips" class="h-screen">
      <ClipCard
        :key="useClip(item).value.uuid"
        :clip="item"
        @play="emit('play', item)"
        @remove="emit('remove', item)"
      />
    </UScrollArea>
  </aside>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props {
  clips: Clip[]
  display?: string
  title?: string
  isOpen?: boolean
}

const { display = undefined, title = 'Queue', isOpen = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'play' | 'remove', value: Clip): void
  (e: 'open' | 'close' | 'clear'): void
}>()
</script>
