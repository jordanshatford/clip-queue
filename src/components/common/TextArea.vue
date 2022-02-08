<template>
  <textarea
    class="block w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-md text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 bg-clip-padding border-2 border-solid border-zinc-200 dark:border-zinc-700 rounded-lg transition ease-in-out m-0 focus:text-zinc-700 focus:border-violet-500 focus:outline-none dark:focus:text-zinc-200 dark:focus:border-violet-500 dark:focus:outline-none"
    :value="props.modelValue"
    @input="emitUpdate($event.target)"
    rows="3"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

function emitUpdate(target: EventTarget | null) {
  emit("update:modelValue", (target as HTMLFormElement).value)
}
</script>
