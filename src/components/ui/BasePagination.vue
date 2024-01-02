<template>
  <div class="flex items-center justify-between border-t border-zinc-300 dark:border-zinc-700">
    <button
      @click="previous()"
      class="cq-text p-3 flex space-x-2 items-center hover:text-brand-500 dark:hover:text-brand-500"
    >
      <ArrowLeftIcon class="w-4 h-4" />
      <p>Previous</p>
    </button>
    <div class="cq-text sm:flex hidden space-x-2">
      <button
        v-for="n in clickableNumbers"
        @click="setPage(n)"
        :key="n"
        class="p-3 border-t-2"
        :class="[n === modelValue ? 'cq-tab-active' : 'cq-tab']"
      >
        {{ n }}
      </button>
    </div>
    <button
      @click="next()"
      class="cq-text p-3 flex space-x-2 items-center hover:text-brand-500 dark:hover:text-brand-500"
    >
      <p>Next</p>
      <ArrowRightIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons'
import { toRangeArray } from '@/utils'

export interface Props {
  totalPages: number
}

// The current page
const modelValue = defineModel<number>({ required: true })
const props = defineProps<Props>()

const clickableNumbers = computed(() => {
  const start = Math.max(modelValue.value - 3, 1)
  const end = Math.min(modelValue.value + 3, props.totalPages)
  return toRangeArray(start, end)
})

function setPage(page: number) {
  modelValue.value = page
}

function previous() {
  modelValue.value = Math.max(modelValue.value - 1, 1)
}

function next() {
  modelValue.value = Math.min(modelValue.value + 1, props.totalPages)
}
</script>
