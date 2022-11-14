<template>
  <div class="flex items-center justify-between border-t border-zinc-300 dark:border-zinc-700">
    <button
      @click="previous()"
      class="cq-text flex space-x-2 items-center hover:text-violet-500 dark:hover:text-violet-500"
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
      class="cq-text flex space-x-2 items-center hover:text-violet-500 dark:hover:text-violet-500"
    >
      <p>Next</p>
      <ArrowRightIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/24/outline"
import { toRangeArray } from "@/utils"

export interface Props {
  modelValue: number // The current page
  totalPages: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
}>()

const clickableNumbers = computed(() => {
  const start = Math.max(props.modelValue - 3, 1)
  const end = Math.min(props.modelValue + 3, props.totalPages)
  return toRangeArray(start, end)
})

function setPage(page: number) {
  emit("update:modelValue", page)
}

function previous() {
  emit("update:modelValue", Math.max(props.modelValue - 1, 1))
}

function next() {
  emit("update:modelValue", Math.min(props.modelValue + 1, props.totalPages))
}
</script>
