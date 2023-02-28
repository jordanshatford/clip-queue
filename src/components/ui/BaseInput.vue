<template>
  <input
    class="cq-input text-right text-xl"
    :value="modelValue"
    @input="emitUpdate($event.target)"
  />
</template>

<script setup lang="ts">
export interface Props {
  modelValue: string | number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

function emitUpdate(target: EventTarget | null) {
  emit('update:modelValue', (target as HTMLFormElement).value as typeof props.modelValue)
}
</script>
