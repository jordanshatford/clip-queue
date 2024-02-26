<template>
  <button
    class="rounded-xl px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-red-500 hover:bg-red-400': variant === 'danger',
      'bg-blue-500 hover:bg-blue-400': variant === 'primary',
      'bg-brand-500 hover:bg-brand-400': variant === 'brand'
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
export interface Props {
  variant?: 'primary' | 'danger' | 'brand'
}

withDefaults(defineProps<Props>(), { variant: 'primary' })
</script>
