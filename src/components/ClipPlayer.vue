<template>
  <div class="player player-container">
    <div class="player player-container h-auto w-full bg-black">
      <iframe
        v-if="playerFormat === 'iframe'"
        :src="playerSource"
        :title="clip.title"
        class="player h-auto w-full bg-black"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        frameborder="0"
      ></iframe>
      <VideoJS
        v-else-if="playerFormat === 'video'"
        :source="playerSource"
        :poster="clip.thumbnailUrl"
        autoplay
      />
      <div v-else class="cq-text flex h-full items-center justify-center">
        <p>Unsupported clip. You may need to enable the provider of this clip.</p>
      </div>
    </div>
    <div class="text-left">
      <h2 class="cq-text mb-1 mt-2 text-2xl font-bold">
        {{ clip.title }}
        <span v-if="clip.url">
          <a
            :href="clip.url"
            target="_blank"
            rel="noreferrer"
            className="cq-text-subtle text-lg no-underline hover:text-surface-600 dark:hover:text-surface-200"
          >
            <i class="pi pi-external-link"></i>
          </a>
        </span>
        <div class="float-right text-base">
          <BButton
            severity="info"
            size="small"
            :disabled="previousDisabled"
            class="mr-2"
            @click="emit('previous')"
          >
            <i class="pi pi-backward px-1 text-lg"></i>
          </BButton>
          <BButton severity="info" size="small" :disabled="nextDisabled" @click="emit('next')">
            <i class="pi pi-forward px-1 text-lg"></i>
          </BButton>
        </div>
      </h2>
      <div class="cq-text-subtle">
        <span v-if="clip.channel && clip.category">
          <span className="cq-text-subtle-semibold">{{ clip.channel }}</span>
          playing
          <span className="cq-text-subtle-semibold">{{ clip.category }}</span>
        </span>
        <span v-if="timeAgo">
          - clipped
          <span className="cq-text-subtle-semibold">{{ timeAgo }}</span>
          ago
        </span>
        <span v-if="clip.submitters[0]">
          - Submitted by
          <span className="cq-text-subtle-semibold">{{ clip.submitters[0] }}</span>
          <span v-if="clip.provider">
            from
            <span className="cq-text-subtle-semibold">{{ clip.provider }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow, parseISO } from 'date-fns'
import type { Clip, PlayerFormat } from '@/providers'
import { useProviders } from '@/stores/providers'
import VideoJS from '@/components/VideoJSPlayer.vue'

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
