<template>
  <div class="mx-auto max-w-xl mb-3 border-b border-zinc-300 dark:border-zinc-700">
    <ul class="cq-text text-sm md:text-base flex flex-wrap -mb-px text-center">
      <li v-for="option in options" :key="option.label" class="mr-2">
        <button
          @click="emit('update:modelValue', option.label)"
          class="flex space-x-1 align-middle p-4 border-b-2 group"
          :class="[option.label === modelValue ? 'cq-tab-active' : 'cq-tab']"
        >
          <component v-if="option.icon" :is="option.icon" class="w-5" /><span>{{ option.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue"

export interface Props {
  modelValue: string
  options: { label: string; icon?: Component }[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()
</script>
