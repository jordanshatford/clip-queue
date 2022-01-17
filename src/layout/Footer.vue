<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-900">
    <div class="flex flex-col items-center px-8 py-6 mx-auto max-w-6xl sm:flex-row">
      <p class="text-gray-400">© {{ year }} {{ creator }}</p>
      <span class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <a
          :href="github"
          class="text-2xl hover:text-purple-500 dark:hover:text-purple-500 text-gray-500 dark:text-gray-200"
          target="_blank"
        >
          <github-icon />
        </a>
      </span>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/config";
import GithubIcon from "@/components/icons/Github.vue";

export default defineComponent({
  components: {
    GithubIcon,
  },
  setup() {
    const { creator, github, year } = config.App;
    return {
      creator,
      github,
      year,
    };
  },
});
</script>
