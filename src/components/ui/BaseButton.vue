<template>
  <button
    class="disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-xl"
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
