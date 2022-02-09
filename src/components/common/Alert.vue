<template>
  <div
    role="alert"
    class="rounded-lg py-2 px-4 text-base"
    :class="{
      'cq-alert-info': variant === 'info',
      'cq-alert-success': variant === 'success',
      'cq-alert-warning': variant === 'warning',
      'cq-alert-danger': variant === 'danger',
    }"
  >
    <v-icon
      :icon="
        variant === 'info'
          ? 'info-circle'
          : variant === 'success'
          ? 'check-circle'
          : variant === 'warning'
          ? 'exclamation-triangle'
          : 'times-circle'
      "
      class="mr-2"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: "info" | "success" | "warning" | "danger"
}

withDefaults(defineProps<Props>(), { variant: "info" })
</script>
