<template>
  <div class="py-2">
    <label v-if="label" class="float-left form-label inline-block pl-1 mb-2 text-zinc-600 dark:text-zinc-400">
      {{ props.label }}
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
}

const props = withDefaults(defineProps<Props>(), { label: "" })
</script>
