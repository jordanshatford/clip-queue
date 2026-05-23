<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const app = useAppConfig()
const queue = useQueue()

useHead({
  title: computed(() => {
    let queueState = queue.settings.open ? 'Open' : 'Closed'
    if (queue.settings.open) {
      queueState = `${queueState} (${queue.upcoming.length})`
    }
    return `${queueState} - ${app.cq.title}`
  }),
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(4px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  filter: blur(4px);
}
</style>
