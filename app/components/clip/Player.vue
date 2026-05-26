<template>
  <div>
    <div class="aspect-video max-h-[calc(100vh-11rem)] w-full bg-black [grid-area:player]">
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

export interface Props {
  clip: Clip
  previousDisabled?: boolean
}

const { clip, previousDisabled = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'previous' | 'next'): void
}>()

const config = useClip(clip).playerConfig
</script>
