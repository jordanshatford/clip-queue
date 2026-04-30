<template>
  <Toast position="bottom-center" />
  <ConfirmDialog :draggable="false" />
  <div :key="preferences.preferences.language" class="h-full min-h-screen dark:bg-surface-950">
    <div class="h-full">
      <AppNavBar />
      <main class="mx-auto h-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
  <AppFooter :copyright="config.copyright" :github="config.github" />
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import { computed } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppNavBar from '@/components/AppNavBar.vue'
import { config } from '@/config'

import { usePreferences } from './stores/preferences'
import { useQueue } from './stores/queue'

const preferences = usePreferences()
const queue = useQueue()

const title = computed((): string => {
  let queueState = queue.isOpen ? 'Open' : 'Closed'
  if (queue.isOpen) {
    queueState = `${queueState} (${queue.upcoming.size()})`
  }
  return `${queueState} - ${config.title}`
})
useTitle(title)
</script>
