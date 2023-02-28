<template>
  <footer class="bg-white dark:bg-zinc-800 border-t border-zinc-300 dark:border-zinc-700">
    <div class="flex flex-col items-center px-8 py-6 mx-auto max-w-6xl sm:flex-row">
      <p class="cq-text">© {{ copyright.year }} {{ copyright.owner }}</p>
      <span class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <p class="cq-text">
          <a
            :href="github"
            class="text-3xl hover:text-brand-500 dark:hover:text-brand-500"
            target="_blank"
          >
            <GithubLogo class="w-8" />
          </a>
        </p>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import GithubLogo from '@/components/icons/GithubLogo.vue'
import config from '@/assets/config'

const { copyright, github } = config
</script>
