<template>
  <div class="w-full bg-zinc-200 dark:bg-zinc-700">
    <div
      class="text-xs font-medium text-zinc-200 text-center p-0.5 leading-none"
      :class="classNames"
      :style="`width: ${value}%`"
    >
      {{ value }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  value: number
  variant?: "primary" | "danger" | "brand"
}

const props = withDefaults(defineProps<Props>(), { variant: "primary" })

const classNames = computed<string>(() => {
  let classes = "bg-blue-500"
  switch (props.variant) {
    case "brand": {
      classes = "bg-violet-500"
      break
    }
    case "danger": {
      classes = "bg-red-500"
      break
    }
  }
  return classes
})
</script>
