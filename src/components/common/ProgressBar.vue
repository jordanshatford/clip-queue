<template>
  <div class="w-full bg-gray-200 dark:bg-gray-700">
    <div
      class="text-xs font-medium text-gray-200 text-center p-0.5 leading-none"
      :class="classNames"
      :style="`width: ${value}%`"
    >
      {{ value }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, defineProps } from "vue";

interface Props {
  value: number;
  variant?: "primary" | "danger" | "brand";
}

const props = withDefaults(defineProps<Props>(), { variant: "primary" });

const classNames = computed(() => {
  let classes = "bg-blue-500";
  switch (props.variant) {
    case "brand": {
      classes = "bg-purple-500";
      break;
    }
    case "danger": {
      classes = "bg-red-500";
      break;
    }
  }
  return classes;
});
</script>
