<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-900">
    <div class="flex flex-col items-center px-8 py-6 mx-auto max-w-6xl sm:flex-row">
      <p class="text-gray-400">© 2021 {{ creator }}</p>
      <span class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <a
          :href="github"
          class="text-2xl hover:text-indigo-800 dark:hover:text-indigo-600 text-gray-500 dark:text-gray-200"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-github"
          >
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            ></path>
          </svg>
        </a>
      </span>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/config";

const { creator, github } = config.App;

export default defineComponent({
  setup() {
    return {
      creator,
      github,
    };
  },
});
</script>
