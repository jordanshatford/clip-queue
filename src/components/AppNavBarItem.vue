<template>
  <router-link v-if="route" :to="route.path" :class="classNames">
    {{ route?.meta?.title }}
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RouteRecordRaw } from "vue-router"

export interface Props {
  isMobileMenu?: boolean
  route: RouteRecordRaw
}

const props = withDefaults(defineProps<Props>(), { isMobileMenu: false })

const classNames = computed<string>(() => {
  let classNames = "px-3 py-2 rounded-lg text-zinc-400 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
  if (props.isMobileMenu) {
    classNames += " block"
  }
  return classNames
})
</script>
