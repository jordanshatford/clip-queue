<template>
  <div class="player-container">
    <Player
      :title="clip.title"
      :format="playerFormat"
      :source="playerSource"
      :thumbnail-url="clip.thumbnailUrl"
    >
      <template #unsupported>{{ m.unsupported_clip() }}</template>
    </Player>
    <div class="mt-2 text-left">
      <div class="flex items-center justify-between">
        <div class="text-surface-500 flex items-center gap-2 text-2xl font-bold">
          <span>{{ clip.title }}</span>
          <a
            v-if="clip.url"
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            class="hover:text-surface-600 dark:hover:text-surface-200 text-base no-underline"
          >
            <i class="pi pi-external-link"></i>
          </a>
        </div>
        <div class="flex gap-2">
          <SecondaryButton
            icon="pi pi-backward"
            :label="m.previous()"
            size="small"
            :disabled="previousDisabled"
            @click="emit('previous')"
          >
          </SecondaryButton>
          <SecondaryButton
            icon="pi pi-forward"
            icon-pos="right"
            :label="m.next()"
            size="small"
            @click="emit('next')"
          >
          </SecondaryButton>
        </div>
      </div>
      <div class="text-surface-400 flex flex-col gap-1 text-sm font-normal">
        <span>
          {{ clip.channel }}
          <span v-if="clip.category"> - {{ clip.category }} </span>
          <span v-if="clip.creator"> - {{ m.creator_name({ name: clip.creator }) }}</span>
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
import { computed } from 'vue'

import type { Clip, PlayerFormat } from '@cq/providers'
import { Player } from '@cq/player'
import { SecondaryButton } from '@cq/ui'

import * as m from '@/paraglide/messages'
import { useProviders } from '@/stores/providers'
import ProviderName from './ProviderName.vue'

export interface Props {
  clip: Clip
  previousDisabled?: boolean
}

const { clip, previousDisabled = false } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
}>()

const providers = useProviders()

const playerFormat = computed<PlayerFormat | undefined>(() => {
  return providers.getPlayerFormat(clip)
})

const playerSource = computed<string | undefined>(() => {
  return providers.getPlayerSource(clip)
})
</script>

<style scoped>
.player-container {
  grid-area: player;
}
</style>
