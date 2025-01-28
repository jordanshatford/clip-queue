<template>
  <footer class="border-surface-100 dark:border-surface-700 dark:bg-surface-900 border-t bg-white">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-8 py-4 sm:flex-row">
      <p v-if="copyright" class="text-surface-600 dark:text-surface-300 font-normal">
        © {{ copyright.year }} {{ copyright.owner }}
      </p>
      <span class="mt-4 inline-flex justify-center space-x-5 sm:mt-0 sm:ml-auto sm:justify-start">
        <p class="text-surface-600 dark:text-surface-300 font-normal">
          <a
            v-if="github"
            :href="github"
            class="hover:text-primary-700 dark:hover:text-primary-700 text-3xl"
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
