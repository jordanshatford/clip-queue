<template>
  <div>
    <div class="aspect-video w-full overflow-hidden rounded-md bg-muted">
      <UEmpty
        v-if="!clip"
        class="h-full w-full"
        variant="naked"
        :title="m.no_clip_selected()"
        :description="m.no_clip_selected_description()"
      />
      <ClipPlayerIFrame v-if="config?.type === 'iframe'" v-bind="config" />
      <ClipPlayerVideo v-else-if="config?.type === 'video'" v-bind="config" />
      <ClipPlayerUnsupported v-else />
    </div>
    <ClipPlayerControls
      :clip
      :previous-disabled="previousDisabled"
      @previous="emit('previous')"
      @next="emit('next')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations/core'

import { m } from '#paraglide/messages'

export interface Props {
  clip: Clip | null
  previousDisabled?: boolean
}

const { clip, previousDisabled = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'previous' | 'next'): void
}>()

const config = clip ? useClip(clip).value.playerConfig : undefined
</script>
