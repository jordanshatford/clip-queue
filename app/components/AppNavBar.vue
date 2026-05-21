<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="mr-2 flex shrink-0 items-center">
        <img class="size-9" src="@/assets/icon.png" />
      </NuxtLink>
    </template>
    <UNavigationMenu :items="items" content-orientation="vertical" />
    <template #right>
      <UColorModeButton size="sm" />
      <AppAuthentication />
    </template>
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

import { m } from '#paraglide/messages'
import { visibleRoutes } from '~/router'

const route = useRoute()
const queue = useQueue()

const t: Record<string, () => string> = {
  '/queue': m.queue,
  '/history': m.history,
  '/settings': m.settings,
  '/logs': m.logs,
  logs: m.logs,
  preferences: m.settings_preferences,
  application: m.application,
  other: m.settings_other,
  integrations: m.integrations,
}

const items = computed<NavigationMenuItem[]>(() => {
  return visibleRoutes.value.map((v) => ({
    label: t[v.path]?.() || '',
    icon: v.meta?.icon,
    to: v.path,
    active: route.path.startsWith(v.path),
    badge: v.name === 'queue' ? queue.upcoming.display : undefined,
    chip:
      v.name === 'queue'
        ? {
            color: queue.settings.open ? 'success' : 'error',
          }
        : undefined,
    children: v.children?.map((c) => ({
      label: t[c.path]?.() || '',
      icon: c.meta?.icon,
      to: v.path + '/' + c.path,
    })),
  }))
})
</script>
