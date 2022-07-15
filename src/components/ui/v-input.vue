<template>
  <input class="cq-input text-right text-xl" :value="modelValue" @input="emitUpdate($event.target)" />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void
}>()

function emitUpdate(target: EventTarget | null) {
  emit("update:modelValue", (target as HTMLFormElement).value as typeof props.modelValue)
}
</script>
