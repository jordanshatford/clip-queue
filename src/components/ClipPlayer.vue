<template>
  <div class="player-container">
    <Player :config>
      <template #unsupported>{{ m.unsupported_clip() }}</template>
    </Player>
    <div class="mt-2 text-left">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-2xl font-bold text-surface-500">
          <span>{{ clip.title }}</span>
          <a
            v-if="clip.url"
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            class="text-base no-underline hover:text-surface-600 dark:hover:text-surface-200"
          >
            <UIIcon name="lucide:external-link" />
          </a>
        </div>
        <div class="flex gap-2">
          <Button
            icon="pi pi-backward"
            :label="m.previous()"
            size="small"
            severity="secondary"
            :disabled="previousDisabled"
            @click="emit('previous')"
          >
          </Button>
          <Button
            icon="pi pi-forward"
            icon-pos="right"
            :label="m.next()"
            size="small"
            severity="secondary"
            @click="emit('next')"
          >
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-1 text-sm font-normal text-surface-400">
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
import Button from 'primevue/button'
import { computed } from 'vue'

import type { Clip } from '@/integrations'

import { Player } from '@/components/player'
import ProviderName from '@/components/ProviderName.vue'
import { m } from '@/paraglide/messages'
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
  (e: 'previous'): void
  (e: 'next'): void
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
