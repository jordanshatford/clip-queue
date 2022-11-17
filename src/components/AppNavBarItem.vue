<template>
  <RouterLink
    v-if="route && ((route.meta?.requiresAuth && isAuthenticated) || !route.meta?.requiresAuth)"
    :to="route.path"
    class="px-3 py-2 my-auto rounded-xl text-zinc-400 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    :class="{ block: isMobileMenu }"
    active-class="text-zinc-700 dark:text-white bg-zinc-100 dark:bg-zinc-900"
  >
    {{ route?.meta?.title }}
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"

export interface Props {
  route: RouteRecordRaw
  isAuthenticated?: boolean
  isMobileMenu?: boolean
}

withDefaults(defineProps<Props>(), { isAuthenticated: false, isMobileMenu: false })
</script>
