<template>
  <div class="py-2">
    <label v-if="label" class="cq-text float-left form-label inline-block pl-1 mb-2">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
}

withDefaults(defineProps<Props>(), { label: "" })
</script>
