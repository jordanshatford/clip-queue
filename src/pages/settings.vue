<template>
  <UTabs
    v-model="active"
    color="primary"
    variant="link"
    :content="false"
    :items="items"
    class="mx-auto mb-3 w-full max-w-2xl justify-around"
  />
  <RouterView />
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { m } from '@/paraglide/messages'
import { visibleRoutes } from '@/router'

definePage({
  redirect: '/settings/application',
  meta: {
    requiresAuth: true,
    icon: 'lucide:settings',
    title: m.settings,
    order: 3,
  },
})

const router = useRouter()
const route = useRoute()

const settingsRoutes = visibleRoutes.value.find((r) => r.name === '/settings')?.children ?? []
const items = computed<TabsItem[]>(() => {
  return settingsRoutes.map((setting) => ({
    label: setting.meta?.title?.() ?? '',
    value: setting.name?.toString() ?? '',
    icon: setting.meta?.icon ?? '',
  }))
})

const active = computed<string>({
  get(): string {
    return route.name?.toString() ?? '/settings'
  },
  set(tab: string) {
    router.push(tab)
  },
})
</script>
