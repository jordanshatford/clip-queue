<template>
  <textarea
    class="cq-input text-left"
    :value="modelValue"
    @input="update($event.target)"
    :rows="rows"
  ></textarea>
</template>

<script setup lang="ts">
export interface Props {
  rows?: number
}

const modelValue = defineModel<string>({ required: true })
withDefaults(defineProps<Props>(), { rows: 3 })

function update(target: EventTarget | null) {
  modelValue.value = (target as HTMLFormElement).value
}
</script>
