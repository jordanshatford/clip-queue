<template>
  <div class="mt-2 text-left">
    <div class="flex items-center justify-between gap-2">
      <span class="truncate text-xl font-bold">{{ clip?.title }}</span>
      <div class="flex items-center gap-2">
        <ClipDropdownMenu v-if="clip" :clip :actions="false" variant="subtle" />
        <UFieldGroup>
          <UButton
            icon="lucide:chevrons-left"
            color="neutral"
            variant="subtle"
            size="sm"
            :disabled="previousDisabled"
            @click="emit('previous')"
            >{{ m.previous() }}</UButton
          >
          <UButton
            trailing-icon="lucide:chevrons-right"
            color="neutral"
            variant="subtle"
            size="sm"
            @click="emit('next')"
            >{{ m.next() }}</UButton
          >
        </UFieldGroup>
      </div>
    </div>
    <div v-if="clip && extras" class="mt-1 flex flex-col gap-1 text-sm font-normal">
      <span class="flex gap-1 align-middle">
        {{ extras.subtitle }}
        <span v-if="extras.submitter"> - {{ m.submitter_name({ name: extras.submitter }) }}</span>
        <UBadge v-if="extras.count" size="sm" color="neutral" variant="soft">
          {{ extras.count }}
        </UBadge>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clip } from '~/integrations'

import { m } from '#paraglide/messages'

export interface Props {
  clip: Clip | null
  previousDisabled?: boolean
}

const { clip, previousDisabled = false } = defineProps<Props>()

const logger = useLogger()

onKeyDown('ArrowLeft', () => {
  logger.debug('[Player]: Left arrow pressed.')
  emit('previous')
})

onKeyDown('ArrowRight', () => {
  logger.debug('[Player]: Right arrow pressed.')
  emit('next')
})

const extras = clip ? useClip(clip) : undefined

const emit = defineEmits<{
  (e: 'previous' | 'next'): void
}>()
</script>
