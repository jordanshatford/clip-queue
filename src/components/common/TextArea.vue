<template>
  <textarea
    class="block w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 bg-clip-padding border-2 border-solid border-gray-200 dark:border-gray-700 rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:border-purple-500 focus:outline-none dark:focus:text-gray-200 dark:focus:border-purple-500 dark:focus:outline-none"
    :value="props.modelValue"
    @input="emitUpdate($event.target)"
    rows="3"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Props {
  modelValue: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function emitUpdate(target: EventTarget | null) {
  emit("update:modelValue", (target as HTMLFormElement).value);
}
</script>
