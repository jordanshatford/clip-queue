<template>
  <footer class="border-t border-surface-100 bg-white dark:border-surface-700 dark:bg-surface-900">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-8 py-4 sm:flex-row">
      <p v-if="copyright" class="font-normal text-surface-600 dark:text-surface-300">
        © {{ copyright.year }} {{ copyright.owner }}
      </p>
      <span class="mt-4 inline-flex justify-center space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
        <p class="font-normal text-surface-600 dark:text-surface-300">
          <a
            v-if="github"
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
interface Props {
  copyright?: {
    owner: string
    year: number
  }
  github?: string
}

defineProps<Props>()
</script>
