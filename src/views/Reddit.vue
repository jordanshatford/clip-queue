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
            :disabled="loading.state[subreddit]"
          >
            <v-icon
              :icon="loading.state[subreddit] ? 'spinner' : 'plus'"
              class="w-4 h-4"
              :class="{ 'animate-spin': loading.state[subreddit] }"
            />
          </v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from "@/assets/config"
import ClipFinder from "@/services/clip-finder"
import { clips } from "@/stores/clips"
import { loading } from "@/stores/loading"

const { maxPostsToCheck, availableSubreddits } = config.Reddit

function queueClipsForSubreddit(subreddit: string) {
  loading.setLoading(subreddit, true)
  ClipFinder.getClipsFromSubreddit(subreddit, (clip, done) => {
    if (!done) {
      clips.addClip(clip, true)
    } else {
      loading.setLoading(subreddit, false)
    }
  })
}
</script>
