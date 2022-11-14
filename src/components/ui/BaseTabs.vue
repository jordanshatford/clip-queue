<template>
  <div class="mx-auto max-w-xl mb-3 border-b border-zinc-200 dark:border-zinc-700">
    <ul class="cq-text flex flex-wrap -mb-px text-center">
      <li v-for="option in options" :key="option.label" class="mr-2">
        <button
          @click="emit('update:modelValue', option.label)"
          class="inline-flex p-4 border-b-2 group"
          :class="[
            option.label === modelValue
              ? 'text-violet-600 border-violet-600 active dark:text-violet-500 dark:border-violet-500'
              : 'border-transparent hover:text-zinc-600 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-600',
          ]"
        >
          <component v-if="option.icon" :is="option.icon" class="w-5 mr-1" />{{ option.label }}
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
