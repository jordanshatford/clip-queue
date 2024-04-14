<template>
  <footer class="border-t border-surface-300 bg-white dark:border-surface-700 dark:bg-surface-800">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-8 py-6 sm:flex-row">
      <p class="cq-text">© {{ copyright.year }} {{ copyright.owner }}</p>
      <span class="mt-4 inline-flex justify-center space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <p class="cq-text">
          <a
            :href="github"
            class="text-3xl hover:text-primary-700 dark:hover:text-primary-700"
            target="_blank"
          >
            <i class="pi pi-github"></i>
          </a>
        </p>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import config from '@/assets/config'

const { copyright, github } = config
</script>
