<template>
  <div
    role="alert"
    class="rounded-lg py-2 px-4 text-base flex justify-center"
    :class="{
      'cq-alert-info': variant === 'info',
      'cq-alert-success': variant === 'success',
      'cq-alert-warning': variant === 'warning',
      'cq-alert-danger': variant === 'danger',
    }"
  >
    <component
      :is="
        variant === 'info'
          ? InformationCircleIcon
          : variant === 'success'
          ? CheckCircleIcon
          : variant === 'warning'
          ? ExclamationTriangleIcon
          : XCircleIcon
      "
      class="mr-1 mt-0.5 w-5"
    ></component>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/vue/24/solid"

interface Props {
  variant?: "info" | "success" | "warning" | "danger"
}

withDefaults(defineProps<Props>(), { variant: "info" })
</script>
