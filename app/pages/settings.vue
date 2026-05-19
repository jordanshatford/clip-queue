<template>
  <div class="flex flex-col">
    <UTabs
      v-model="active"
      color="primary"
      variant="link"
      :content="false"
      :items="items"
      class="mx-auto mb-3 w-full max-w-2xl justify-around"
    />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { m } from '#paraglide/messages'
import { visibleRoutes } from '@/router'

definePageMeta({
  redirect: '/settings/application',
  requiresAuth: true,
  icon: 'lucide:settings',
  order: 3,
})

const router = useRouter()
const route = useRoute()

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

const settingsRoutes = visibleRoutes.value.find((r) => r.name === 'settings')?.children ?? []
const items = computed<TabsItem[]>(() => {
  return settingsRoutes.map((setting) => ({
    label: t[setting.path]?.() ?? '',
    value: setting.path ? `/settings/${setting.path}` : '',
    icon: setting.meta?.icon ?? '',
  }))
})

const active = computed<string>({
  get(): string {
    return route.path
  },
  set(tab: string) {
    router.push(tab)
  },
})
</script>
