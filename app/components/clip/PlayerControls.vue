<template>
  <div class="mt-2 text-left">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-2xl font-bold">
        <span>{{ clip.title }}</span>
        <a
          v-if="clip.url"
          :href="clip.url"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center justify-center text-base no-underline"
        >
          <UIcon name="lucide:external-link" />
        </a>
      </div>
      <div class="flex gap-2">
        <UButton
          icon="lucide:rewind"
          color="neutral"
          variant="soft"
          :disabled="previousDisabled"
          @click="emit('previous')"
          >{{ m.previous() }}</UButton
        >
        <UButton
          trailing-icon="lucide:fast-forward"
          color="neutral"
          variant="soft"
          @click="emit('next')"
          >{{ m.next() }}</UButton
        >
      </div>
    </div>
    <div class="flex flex-col gap-1 text-sm font-normal">
      <span>
        {{ clip.channel }}
        <span v-if="clip.category"> - {{ clip.category }} </span>
        <span v-if="clip.submitters[0]">
          - {{ m.submitter_name({ name: clip.submitters[0] }) }}</span
        >
      </span>
      <ClipProviderName :id="clip.provider" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props {
  clip: Clip
  previousDisabled?: boolean
}

const { clip, previousDisabled = false } = defineProps<Props>()

const logger = useLogger()

onKeyDown('ArrowLeft', () => {
  logger.debug('[Player]: left arrow pressed.')
  emit('previous')
})

onKeyDown('ArrowRight', () => {
  logger.debug('[Player]: right arrow pressed.')
  emit('next')
})

const emit = defineEmits<{
  (e: 'previous' | 'next'): void
}>()
</script>
