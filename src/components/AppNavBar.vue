<template>
  <Menubar
    :model="items"
    breakpoint="768px"
    class="sticky top-0 z-50 mx-auto bg-surface-0 px-2 sm:px-16 md:px-10 lg:px-32 dark:bg-surface-900"
  >
    <template #start>
      <RouterLink to="/" class="mr-2 flex shrink-0 items-center">
        <img class="aspect-square w-10" src="@/assets/icon.png" />
      </RouterLink>
    </template>
    <template #item="{ item, props, hasSubmenu }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
        <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <AppThemeToggle :is-dark-mode="preferences.isDark" @toggle="preferences.toggleTheme()" />
        <AppAuthentication />
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

import Menubar from 'primevue/menubar'
import { computed } from 'vue'

import AppAuthentication from '@/components/AppAuthentication.vue'
import AppThemeToggle from '@/components/AppThemeToggle.vue'
import { visibleRoutes } from '@/router'
import { usePreferences } from '@/stores/preferences'

const preferences = usePreferences()

const items = computed((): MenuItem[] => {
  return visibleRoutes.value.map((v) => ({
    label: v.meta?.title?.(),
    icon: v.meta?.icon,
    route: v.children ? undefined : { name: v.name },
    items: v.children?.map((c) => ({
      label: c.meta?.title?.(),
      icon: c.meta?.icon,
      route: { name: c.name },
    })),
  }))
})
</script>
