<template>
  <div class="mx-auto mb-3 max-w-xl border-b border-zinc-300 dark:border-zinc-700">
    <ul class="cq-text -mb-px flex flex-wrap text-center text-sm md:text-base">
      <li v-for="option in options" :key="option.label" class="mr-2">
        <button
          @click="modelValue = option.label"
          class="group flex space-x-1 border-b-2 p-4 align-middle"
          :class="[option.label === modelValue ? 'cq-tab-active' : 'cq-tab']"
        >
          <component v-if="option.icon" :is="option.icon" class="w-5" /><span>{{
            option.label
          }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface Props {
  options: { label: string; icon?: Component }[]
}

const modelValue = defineModel<string>({ required: true })
defineProps<Props>()
</script>
