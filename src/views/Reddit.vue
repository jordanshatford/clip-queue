<template>
  <p class="cq-title">From Reddit</p>
  <p class="cq-text flex items-center justify-center">
    Queue clips found in the top
    <v-input class="inline py-1 px-1 w-16 mx-1" min="1" max="100" type="number" v-model.trim="reddit.postsToCheck" />
    posts.
  </p>
  <div class="grid gap-6 grid-cols-1 mt-3">
    <div v-for="(subreddit, index) in DEFAULT_SUBREDDITS" :key="index">
      <div class="cq-card mx-auto max-w-md">
        <div class="flex items-center justify-between">
          <p class="cq-text text-2xl pl-3">r/{{ subreddit }}</p>
          <v-button
            class="m-3 float-right"
            @click="queueClipsForSubreddit(subreddit)"
            :disabled="reddit.isLoading(subreddit)"
          >
            <v-icon
              :icon="reddit.isLoading(subreddit) ? 'spinner' : 'plus'"
              class="w-4 h-4"
              :class="{ 'animate-spin': reddit.isLoading(subreddit) }"
            />
          </v-button>
        </div>
      </div>
    </div>
    <div class="cq-card mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <p class="cq-text text-2xl pl-3 pr-1">r/</p>
        <v-input
          :disabled="reddit.isLoading(reddit.custom)"
          class="inline"
          type="text"
          maxlength="25"
          v-model.trim="reddit.custom"
        />
        <v-button
          class="m-3 float-right"
          @click="queueClipsForSubreddit(reddit.custom)"
          :disabled="reddit.isLoading(reddit.custom) || !reddit.custom"
        >
          <v-icon
            :icon="reddit.isLoading(reddit.custom) ? 'spinner' : 'plus'"
            class="w-4 h-4"
            :class="{ 'animate-spin': reddit.isLoading(reddit.custom) }"
          />
        </v-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClips } from "@/stores/clips"
import { useReddit, DEFAULT_SUBREDDITS } from "@/stores/reddit"
import { useClipFinder } from "@/stores/clip-finder"

const reddit = useReddit()
const clips = useClips()

async function queueClipsForSubreddit(subreddit: string) {
  reddit.setLoading(subreddit, true)
  const clipFinder = useClipFinder()
  await clipFinder.getClipsFromSubreddit(subreddit, (clip, done) => {
    if (!done) {
      clips.add(clip, true)
    } else {
      reddit.setLoading(subreddit, false)
    }
  })
  reddit.setLoading(subreddit, false)
}
</script>
