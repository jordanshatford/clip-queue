<template>
  <RouterLink
    v-if="route"
    :to="route.path"
    class="px-3 py-2 my-auto rounded-lg text-zinc-400 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
    :class="{ block: isMobileMenu }"
  >
    {{ route?.meta?.title }}
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"

export interface Props {
  route: RouteRecordRaw
  isMobileMenu?: boolean
}

withDefaults(defineProps<Props>(), { isMobileMenu: false })
</script>
