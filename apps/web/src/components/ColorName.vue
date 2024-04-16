<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-4 rounded-full" :style="{ backgroundColor: `rgb(${color})` }"></span>
    <div>{{ name }}</div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  name: string
  color: string
}

defineProps<Props>()
</script>
