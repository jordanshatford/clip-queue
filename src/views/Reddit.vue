<template>
  <div class="text-center">
    <p class="text-5xl font-extrabold text-purple-500 p-5">From Reddit</p>
    <p class="dark:text-gray-300">Queue clips found in the top {{ maxPostsToCheck }} posts.</p>
    <div class="grid gap-6 grid-cols-1 mt-3">
      <div
        v-for="(subreddit, index) in availableSubreddits"
        :key="index"
        class="bg-gray-100 dark:bg-gray-800 w-full max-w-sm mx-auto rounded-lg shadow-md"
      >
        <div class="flex items-center justify-between">
          <span class="ml-5 text-gray-600 dark:text-gray-400 text-2xl">r/{{ subreddit }}</span>
          <v-button
            class="m-3 float-right"
            @click="queueClipsForSubreddit(subreddit)"
            :disabled="loading.state[subreddit]"
          >
            <v-icon
              :icon="loading.state[subreddit] ? 'spinner' : 'plus'"
              class="w-4 h-4"
              :class="loading.state[subreddit] ? 'animate-spin' : ''"
            />
          </v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from "@/assets/config";
import ClipFinder from "@/services/clip-finder";
import { clipQueue } from "@/stores/queue";
import { loading } from "@/stores/loading";

const { maxPostsToCheck, availableSubreddits } = config.Reddit;

function queueClipsForSubreddit(subreddit: string) {
  loading.setLoading(subreddit, true);
  ClipFinder.getClipsFromSubreddit(subreddit, (clip, done) => {
    if (!done) {
      clipQueue.addClip(clip, true);
    } else {
      loading.setLoading(subreddit, false);
    }
  });
}
</script>
