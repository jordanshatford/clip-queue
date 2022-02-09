<template>
  <input class="cq-input text-right text-xl" :value="modelValue" @input="emitUpdate($event.target)" />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

function emitUpdate(target: EventTarget | null) {
  emit("update:modelValue", (target as HTMLFormElement).value)
}
</script>
