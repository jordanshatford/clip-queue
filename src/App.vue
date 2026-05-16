<template>
  <UIApp :key="preferences.locale">
    <ConfirmDialog :draggable="false" />
    <AppNavBar />
    <UIMain>
      <main class="mx-auto h-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </UIMain>
    <AppFooter :copyright="config.copyright" :github="config.github" />
  </UIApp>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import ConfirmDialog from 'primevue/confirmdialog'
import { computed, watch } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppNavBar from '@/components/AppNavBar.vue'
import { config } from '@/config'

import { useIntegrations } from './stores/integrations'
import { usePreferences } from './stores/preferences'
import { useQueue } from './stores/queue'

const toast = useToast()
const preferences = usePreferences()
const queue = useQueue()
const integrations = useIntegrations()

// Watch for any toasts coming from the integrations.
watch(
  () => integrations.message,
  (message) => {
    if (!message) {
      return
    }
    toast.add(message)
  },
)

const title = computed((): string => {
  let queueState = queue.settings.open ? 'Open' : 'Closed'
  if (queue.settings.open) {
    queueState = `${queueState} (${queue.upcoming.length})`
  }
  return `${queueState} - ${config.title}`
})
useTitle(title)
</script>
