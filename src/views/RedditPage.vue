<template>
  <p class="cq-title">From Reddit</p>
  <p class="cq-text flex items-center justify-center">
    Queue clips found in the top
    <BaseInput class="inline py-1 px-1 w-16 mx-1" min="1" max="100" type="number" v-model.trim="reddit.postsToCheck" />
    posts.
  </p>
  <div class="grid gap-6 grid-cols-1 mt-3">
    <div v-for="(subreddit, index) in DEFAULT_SUBREDDITS" :key="index">
      <div class="cq-card mx-auto max-w-md">
        <div class="flex items-center justify-between">
          <p class="cq-text text-2xl pl-3">r/{{ subreddit }}</p>
          <BaseButton
            class="m-3 float-right"
            @click="queueClipsForSubreddit(subreddit)"
            :disabled="reddit.isLoading(subreddit)"
          >
            <component :is="reddit.isLoading(subreddit) ? LoadingIcon : PlusIcon" class="my-1 w-5 h-5"></component>
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="cq-card mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <p class="cq-text text-2xl pl-3 pr-1">r/</p>
        <BaseInput
          :disabled="reddit.isLoading(reddit.custom)"
          class="inline"
          type="text"
          maxlength="25"
          v-model.trim="reddit.custom"
        />
        <BaseButton
          class="m-3 float-right"
          @click="queueClipsForSubreddit(reddit.custom)"
          :disabled="reddit.isLoading(reddit.custom) || !reddit.custom"
        >
          <component :is="reddit.isLoading(reddit.custom) ? LoadingIcon : PlusIcon" class="my-1 w-5 h-5"></component>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/outline"
import LoadingIcon from "@/components/LoadingIcon.vue"
import { useQueue } from "@/stores/queue"
import { useReddit, DEFAULT_SUBREDDITS } from "@/stores/reddit"
import { useClipFinder } from "@/stores/clip-finder"
import { ClipSource } from "@/interfaces/clips"

const reddit = useReddit()
const queue = useQueue()

async function queueClipsForSubreddit(subreddit: string) {
  reddit.setLoading(subreddit, true)
  const clipFinder = useClipFinder()
  const clips = await clipFinder.getClipsFromSubreddit(subreddit)
  clips.forEach((c) => {
    queue.add({ ...c, source: ClipSource.Reddit }, true)
  })
  reddit.setLoading(subreddit, false)
}
</script>
