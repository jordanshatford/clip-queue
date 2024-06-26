<template>
  <div class="player player-container">
    <Player
      :title="clip.title"
      :format="playerFormat"
      :source="playerSource"
      :thumbnail-url="clip.thumbnailUrl"
    />
    <div class="mt-2 text-left">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-2xl font-bold font-normal text-surface-400">
          <span>{{ clip.title }}</span>
          <a
            v-if="clip.url"
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            class="text-base no-underline hover:text-surface-600 dark:hover:text-surface-200"
          >
            <i class="pi pi-external-link"></i>
          </a>
        </div>
        <div class="flex gap-2">
          <Button
            icon="pi pi-backward"
            label="Previous"
            severity="info"
            size="small"
            :disabled="previousDisabled"
            @click="emit('previous')"
          >
          </Button>
          <Button
            icon="pi pi-forward"
            icon-pos="right"
            label="Next"
            severity="info"
            size="small"
            :disabled="nextDisabled"
            @click="emit('next')"
          >
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-1 text-sm font-normal text-surface-400">
        <span>
          {{ clip.channel }}
          <span v-if="clip.category"> - {{ clip.category }} </span>
          <span v-if="clip.submitters[0]"> - Submitter: {{ clip.submitters[0] }} </span>
        </span>
        <ProviderName :provider="clip.provider" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Clip, PlayerFormat } from '@cq/providers'
import Player from '@cq/player'
import { Button } from '@cq/ui'

import { useProviders } from '@/stores/providers'
import ProviderName from './ProviderName.vue'

export interface Props {
  clip: Clip
  previousDisabled?: boolean
  nextDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  previousDisabled: false,
  nextDisabled: false
})

const emit = defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
}>()

const providers = useProviders()

const playerFormat = computed<PlayerFormat | undefined>(() => {
  return providers.getPlayerFormat(props.clip)
})

const playerSource = computed<string | undefined>(() => {
  return providers.getPlayerSource(props.clip)
})
</script>

<style>
.player-container {
  grid-area: player;
}

.player {
  aspect-ratio: 16 / 9;
  max-height: calc(100vh - 11rem);
}
</style>
