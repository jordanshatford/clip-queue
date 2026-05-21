<template>
  <UApp :key="preferences.locale">
    <AppNavBar />
    <UMain>
      <main class="mx-auto h-full max-w-7xl px-4 py-5 text-center sm:px-6 lg:px-8">
        <NuxtPage />
      </main>
    </UMain>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
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

const app = useAppConfig()

const title = computed((): string => {
  let queueState = queue.settings.open ? 'Open' : 'Closed'
  if (queue.settings.open) {
    queueState = `${queueState} (${queue.upcoming.length})`
  }
  return `${queueState} - ${app.cq.title}`
})
useTitle(title)
</script>
