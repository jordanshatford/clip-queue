<template>
  <router-link v-if="route" :to="route.path" :class="classNames">
    {{ route.name }}
  </router-link>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";
import { RouteRecordRaw } from "vue-router";

interface Props {
  isMobileMenu?: boolean;
  route: RouteRecordRaw;
}

const props = withDefaults(defineProps<Props>(), { isMobileMenu: false });

const classNames = computed(() => {
  let classNames = "px-3 py-2 rounded-lg text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  if (props.isMobileMenu) {
    classNames += " block";
  }
  return classNames;
});
</script>
