<template>
  <div class="w-full bg-zinc-200 dark:bg-zinc-700">
    <div
      id="progressBar"
      class="text-xs font-medium text-zinc-200 text-center p-0.5 leading-none"
      :class="{
        'bg-red-500': variant === 'danger',
        'bg-blue-500': variant === 'primary',
        'bg-violet-500': variant === 'brand',
      }"
      :style="`width: ${value}%`"
    >
      {{ value }}%
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  variant?: "primary" | "danger" | "brand"
}

withDefaults(defineProps<Props>(), { variant: "primary" })
</script>
