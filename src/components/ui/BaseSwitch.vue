<template>
  <div
    class="relative h-6 w-12 rounded-full transition duration-200 ease-linear"
    :class="[modelValue ? 'bg-brand-500' : 'bg-zinc-400']"
  >
    <label
      :for="id"
      class="absolute left-0 mb-2 h-6 w-6 transform cursor-pointer rounded-full border-2 bg-white transition duration-100 ease-linear"
      :class="[modelValue ? 'translate-x-full border-brand-500' : 'translate-x-0 border-zinc-400']"
    ></label>
    <input
      type="checkbox"
      :id="id"
      :name="id"
      class="h-full w-full appearance-none focus:outline-none"
      :value="modelValue"
      @input="modelValue = !modelValue"
    />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  id: string
}

const modelValue = defineModel<boolean>({ default: false })
defineProps<Props>()
</script>
