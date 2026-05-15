<template>
  <UIHeader>
    <template #title>
      <RouterLink to="/" class="mr-2 flex shrink-0 items-center">
        <img class="size-9" src="@/assets/icon.png" />
      </RouterLink>
    </template>
    <UINavigationMenu :items="items" content-orientation="vertical" />
    <template #right>
      <UIColorModeButton size="sm" />
      <AppAuthentication />
    </template>
    <template #body>
      <UINavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UIHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { visibleRoutes } from '@/router'
import { useQueue } from '@/stores/queue'

const route = useRoute()
const queue = useQueue()

const items = computed<NavigationMenuItem[]>(() => {
  return visibleRoutes.value.map((v) => ({
    label: v.meta?.title?.(),
    icon: v.meta?.icon,
    to: v.path,
    active: route.path.startsWith(v.path),
    badge: v.name === '/queue' ? queue.upcoming.display : undefined,
    chip:
      v.name === '/queue'
        ? {
            color: queue.settings.open ? 'success' : 'error',
          }
        : undefined,
    children: v.children?.map((c) => ({
      label: c.meta?.title?.(),
      icon: c.meta?.icon,
      to: v.path + '/' + c.path,
    })),
  }))
})
</script>
