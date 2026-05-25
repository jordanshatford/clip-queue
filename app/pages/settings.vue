<template>
  <div class="flex flex-col">
    <UTabs
      v-model="active"
      color="primary"
      variant="link"
      :content="false"
      :items="routes.settings.value"
      class="mx-auto mb-3 w-full max-w-2xl justify-around"
    />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: '/settings/application',
  requiresAuth: true,
  icon: 'lucide:settings',
  order: 3,
})

const route = useRoute()
const routes = useVisibleRoutes()

const active = computed<string>({
  get(): string {
    return route.path
  },
  set(tab: string) {
    navigateTo(tab)
  },
})
</script>
