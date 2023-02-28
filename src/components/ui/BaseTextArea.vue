<template>
  <textarea
    class="cq-input text-left"
    :value="modelValue"
    @input="emitUpdate($event.target)"
    :rows="rows"
  ></textarea>
</template>

<script setup lang="ts">
export interface Props {
  modelValue: string
  rows?: number
}

withDefaults(defineProps<Props>(), { rows: 3 })

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function emitUpdate(target: EventTarget | null) {
  emit('update:modelValue', (target as HTMLFormElement).value)
}
</script>
