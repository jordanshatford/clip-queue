<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-900">
    <div class="flex flex-col items-center px-8 py-6 mx-auto max-w-6xl sm:flex-row">
      <p class="text-gray-400">© {{ year }} {{ creator }}</p>
      <span class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <a
          :href="github"
          class="text-3xl hover:text-purple-500 dark:hover:text-purple-500 text-gray-500 dark:text-gray-200"
          target="_blank"
        >
          <v-icon :icon="['fab', 'github']" />
        </a>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import config from "@/assets/config";

const { creator, github, year } = config.App;
</script>
