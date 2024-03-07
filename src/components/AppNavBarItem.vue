<template>
  <RouterLink
    v-if="route && ((route.meta?.requiresAuth && isAuthenticated) || !route.meta?.requiresAuth)"
    :to="route.path"
    class="my-auto rounded-xl px-3 py-2 text-surface-400 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
    :class="{ block: isMobileMenu }"
    active-class="text-surface-700 dark:text-white bg-surface-100 dark:bg-surface-900"
  >
    {{ route?.meta?.title }}
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

export interface Props {
  route: RouteRecordRaw
  isAuthenticated?: boolean
  isMobileMenu?: boolean
}

withDefaults(defineProps<Props>(), { isAuthenticated: false, isMobileMenu: false })
</script>
