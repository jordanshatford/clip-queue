<template>
  <UIPageCard :title :description :icon spotlight spotlight-color="primary" />
</template>

<script setup lang="ts">
export interface Props {
  title: string
  description: string
  icon: string
}

defineProps<Props>()
</script>
