<template>
  <button
    class="cq-btn"
    :class="{
      'cq-btn-danger': variant === 'danger',
      'cq-btn-primary': variant === 'primary',
      'cq-btn-brand': variant === 'brand',
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "danger" | "brand"
}

withDefaults(defineProps<Props>(), { variant: "primary" })
</script>
