<template>
  <button
    class="disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 border-b-4 rounded-lg"
    :class="classNames"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface Props {
  variant?: "primary" | "danger" | "brand"
}

const props = withDefaults(defineProps<Props>(), { variant: "primary" })

const classNames = computed<string>(() => {
  let classes = "bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500"
  switch (props.variant) {
    case "brand": {
      classes = "bg-violet-500 border-violet-700 hover:bg-violet-400 hover:border-violet-500"
      break
    }
    case "danger": {
      classes = "bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500"
      break
    }
  }
  return classes
})
</script>
