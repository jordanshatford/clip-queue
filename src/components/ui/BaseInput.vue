<template>
  <input class="cq-input text-right text-xl" :value="modelValue" @input="update($event.target)" />
</template>

<script setup lang="ts">
const modelValue = defineModel<string | number | null | undefined>({ default: undefined })

function update(target: EventTarget | null) {
  modelValue.value = (target as HTMLFormElement).value as typeof modelValue.value
}
</script>
