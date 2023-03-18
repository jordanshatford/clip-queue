<template>
  <p class="cq-title">From Reddit</p>
  <p class="cq-text flex items-center justify-center">
    Queue clips found in the top
    <BaseInput
      class="inline py-1 px-1 w-16 mx-1"
      min="1"
      max="100"
      type="number"
      v-model.trim="reddit.postsToCheck"
    />
    posts.
  </p>
  <div class="grid gap-4 grid-cols-1 mt-3">
    <div class="cq-card mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <p class="cq-text text-2xl pl-3 pr-1">r/</p>
        <BaseInput
          :disabled="reddit.loading"
          class="inline"
          type="text"
          maxlength="25"
          v-model.trim="reddit.subreddit"
        />
        <BaseButton
          class="m-3 float-right"
          @click="queueClipsForSubreddit(reddit.subreddit)"
          :disabled="reddit.loading"
        >
          <component :is="reddit.loading ? LoadingIcon : PlusIcon" class="w-5 h-5"></component>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { PlusIcon } from '@/assets/icons'
import LoadingIcon from '@/components/icons/LoadingIcon.vue'
import { useQueue } from '@/stores/queue'
import { useReddit } from '@/stores/reddit'
import { useClipFinder } from '@/stores/clip-finder'
import { ClipSource } from '@/interfaces/clips'

const toast = useToast()
const reddit = useReddit()
const queue = useQueue()

async function queueClipsForSubreddit(subreddit: string) {
  reddit.loading = true
  const clipFinder = useClipFinder()
  try {
    const clips = await clipFinder.getClipsFromSubreddit(subreddit)
    clips.forEach((c) => {
      queue.add({ ...c, source: ClipSource.Reddit }, true)
    })
  } catch (e) {
    toast.error(`Failed to get clips from r/${subreddit}`)
  }
  reddit.loading = false
}
</script>
