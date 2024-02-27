<template>
  <div class="player player-container">
    <div v-if="clip.id" class="player player-container h-auto w-full bg-black">
      <iframe
        v-if="clip.provider === ClipProvider.TWITCH"
        :src="`${clip.embedUrl}&autoplay=${autoplay}&parent=${hostname}`"
        :title="clip.title"
        class="player h-auto w-full bg-black"
        allowfullscreen
      ></iframe>
      <VideoJS
        v-else-if="clip.provider === ClipProvider.KICK"
        :source="clip.embedUrl"
        :poster="clip.thumbnailUrl"
        :autoplay="autoplay"
      />
      <div v-else class="cq-text flex h-full items-center justify-center">
        <p>Unsupported video format</p>
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
            className="cq-text-subtle text-lg no-underline hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <ArrowTopRightOnSquareIcon class="mb-3 inline-block w-6" />
          </a>
        </span>
        <div class="float-right text-base">
          <BaseButton :disabled="previousDisabled" class="mr-2" @click="emit('previous')">
            <BackwardIcon class="w-8" />
          </BaseButton>
          <BaseButton :disabled="nextDisabled" @click="emit('next')">
            <ForwardIcon class="w-8" />
          </BaseButton>
        </div>
      </h2>
      <div class="cq-text-subtle">
        <span v-if="clip.channel && clip.game">
          <span className="cq-text-subtle-semibold">{{ clip.channel }}</span>
          playing
          <span className="cq-text-subtle-semibold">{{ clip.game }}</span>
        </span>
        <span v-if="timeAgo">
          - clipped
          <span className="cq-text-subtle-semibold">{{ timeAgo }}</span>
          ago
        </span>
        <span v-if="clip.submitter">
          - Submitted by
          <span className="cq-text-subtle-semibold">{{ clip.submitter }}</span>
          <span v-if="clip.source">
            from
            <span className="cq-text-subtle-semibold">{{ clip.source }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTopRightOnSquareIcon, BackwardIcon, ForwardIcon } from '@/assets/icons'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ClipProvider, type Clip } from '@/interfaces/clips'
import VideoJS from './VideoJSPlayer.vue'

export interface Props {
  clip: Clip
  autoplay?: boolean
  previousDisabled?: boolean
  nextDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  previousDisabled: false,
  nextDisabled: false
})

const emit = defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
}>()

const timeAgo = computed<string>(() => {
  if (props.clip?.timestamp) {
    return formatDistanceToNow(parseISO(props.clip.timestamp))
  }
  return ''
})

const hostname = window.location.hostname
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
