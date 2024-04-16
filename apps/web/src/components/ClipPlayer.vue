<template>
  <div class="player player-container">
    <Player
      :title="clip.title"
      :format="playerFormat"
      :source="playerSource"
      :thumbnail-url="clip.thumbnailUrl"
    />
    <div class="text-left">
      <h2 class="mb-1 mt-2 text-2xl font-bold font-normal text-surface-600 dark:text-surface-400">
        {{ clip.title }}
        <span v-if="clip.url">
          <a
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            class="text-lg text-sm font-normal text-surface-400 no-underline hover:text-surface-600 dark:text-surface-600 dark:hover:text-surface-200"
          >
            <i class="pi pi-external-link"></i>
          </a>
        </span>
        <div class="float-right text-base">
          <Button
            icon="pi pi-backward"
            label="Previous"
            severity="info"
            size="small"
            :disabled="previousDisabled"
            class="mr-2"
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
      </h2>
      <div class="text-sm font-normal text-surface-400 dark:text-surface-600">
        <span v-if="clip.channel && clip.category">
          <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
            clip.channel
          }}</span>
          playing
          <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
            clip.category
          }}</span>
        </span>
        <span v-else>
          <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
            clip.channel
          }}</span>
        </span>
        <span v-if="timeAgo">
          - Created
          <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
            timeAgo
          }}</span>
          ago
        </span>
        <span v-if="clip.submitters[0]">
          - Submitted by
          <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
            clip.submitters[0]
          }}</span>
          <span v-if="clip.provider">
            from
            <span class="text-sm font-semibold text-surface-400 dark:text-surface-600">{{
              clip.provider
            }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Player from '@cq/player'
import type { Clip, PlayerFormat } from '@cq/providers'
import { Button } from '@cq/ui'
import { useProviders } from '@/stores/providers'

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

const timeAgo = computed<string>(() => {
  if (props.clip?.createdAt) {
    return formatDistanceToNow(parseISO(props.clip.createdAt))
  }
  return ''
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
