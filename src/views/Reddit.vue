<template>
  <p class="cq-title">From Reddit</p>
  <p class="cq-text">Queue clips found in the top {{ maxPostsToCheck }} posts.</p>
  <div class="grid gap-6 grid-cols-1 mt-3">
    <div v-for="(subreddit, index) in availableSubreddits" :key="index">
      <div class="cq-card max-w-md">
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
    <div class="cq-card max-w-md">
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
          :disabled="reddit.isLoading(reddit.custom)"
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
import config from "@/assets/config"
import ClipFinder from "@/services/clip-finder"
import { clips } from "@/stores/clips"
import { useReddit } from "@/stores/reddit"

const { maxPostsToCheck, availableSubreddits } = config.Reddit

const reddit = useReddit()

async function queueClipsForSubreddit(subreddit: string) {
  reddit.setLoading(subreddit, true)
  await ClipFinder.getClipsFromSubreddit(subreddit, (clip, done) => {
    if (!done) {
      clips.addClip(clip, true)
    } else {
      reddit.setLoading(subreddit, false)
    }
  })
  reddit.setLoading(subreddit, false)
}
</script>
