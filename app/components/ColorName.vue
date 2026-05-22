<template>
  <div class="flex items-center gap-2">
    <span class="h-4 w-4 rounded-full" :class="color.class" />
    <div>{{ color.text() }}</div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  name: PrimaryColorName | NeutralColorName
}

const { name } = defineProps<Props>()

const color = computed(() => colorDetails[name])
</script>
