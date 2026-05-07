<template>
  <Tabs :value="active" scrollable class="mx-auto mb-3 w-full max-w-2xl">
    <TabList class="w-full overflow-hidden" :pt="{ root: { class: 'bg-transparent' } }">
      <Tab
        v-for="setting in settingsRoutes"
        :key="setting.name"
        :value="setting?.name?.toString() ?? ''"
      >
        <router-link v-slot="{ href, navigate }" :to="setting.path" custom>
          <a :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
            <i :class="setting.meta?.icon"></i>
            <span>{{ setting.meta?.title?.() }}</span>
          </a>
        </router-link>
      </Tab>
    </TabList>
  </Tabs>
  <RouterView />
</template>

<script setup lang="ts">
import { onKeyDown } from '@vueuse/core'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import Tabs from 'primevue/tabs'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { m } from '@/paraglide/messages'
import { visibleRoutes } from '@/router'

definePage({
  redirect: '/settings/application',
  meta: {
    requiresAuth: true,
    icon: 'pi pi-cog',
    title: m.settings,
    order: 3,
  },
})

const router = useRouter()
const route = useRoute()

const settingsRoutes = visibleRoutes.value.find((r) => r.name === '/settings')?.children ?? []

const active = computed(() => route?.name?.toString() ?? '')
const current = computed(() => settingsRoutes.findIndex((r) => r.name === route.name))

onKeyDown('ArrowLeft', () => {
  if (current.value > 0) {
    const previous = settingsRoutes[current.value - 1]
    if (previous) {
      router.push(previous.path)
    }
  }
})

onKeyDown('ArrowRight', () => {
  if (current.value < settingsRoutes.length - 1) {
    const next = settingsRoutes[current.value + 1]
    if (next) {
      router.push(next.path)
    }
  }
})
</script>
