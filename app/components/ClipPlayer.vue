<template>
  <div class="player-container">
    <Player :config>
      <template #unsupported>{{ m.unsupported_clip() }}</template>
    </Player>
    <div class="mt-2 text-left">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-2xl font-bold">
          <span>{{ clip.title }}</span>
          <a
            v-if="clip.url"
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            class="text-base no-underline"
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
        <ProviderName :provider="clip.provider" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyDown } from '@vueuse/core'
import { computed } from 'vue'

import type { Clip } from '@/integrations'

import { m } from '#paraglide/messages'
import { Player } from '@/components/player'
import ProviderName from '@/components/ProviderName.vue'
import { useIntegrations } from '@/stores/integrations'
import { useLogger } from '@/stores/logger'

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

const integrations = useIntegrations()

const config = computed(() => {
  return integrations.provider(clip.provider)?.getPlayerConfig(clip)
})
</script>

<style scoped>
.player-container {
  grid-area: player;
}
</style>
