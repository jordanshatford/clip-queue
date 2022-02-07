<template>
  <div class="rounded-lg py-2 px-4 text-base" :class="classNames" role="alert">
    <v-icon :icon="icon" class="mr-2" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";

interface Props {
  variant?: "info" | "success" | "warning" | "danger";
}

const props = withDefaults(defineProps<Props>(), { variant: "info" });

const icon = computed(() => {
  let icon = "info-circle";
  switch (props.variant) {
    case "success": {
      icon = "check-circle";
      break;
    }
    case "warning": {
      icon = "exclamation-triangle";
      break;
    }
    case "danger": {
      icon = "times-circle";
      break;
    }
  }
  return icon;
});
const classNames = computed(() => {
  let classes = "bg-blue-100 dark:bg-blue-200 text-blue-700";
  switch (props.variant) {
    case "success": {
      classes = "bg-green-100 dark:bg-green-200 text-green-700";
      break;
    }
    case "warning": {
      classes = "bg-yellow-100 dark:bg-yellow-200 text-yellow-700";
      break;
    }
    case "danger": {
      classes = "bg-red-100 dark:bg-red-200 text-red-700";
      break;
    }
  }
  return classes;
});
</script>
