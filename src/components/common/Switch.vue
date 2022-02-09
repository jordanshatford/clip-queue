<template>
  <div
    class="relative w-12 h-6 transition duration-200 ease-linear rounded-full"
    :class="[modelValue ? 'bg-violet-500' : 'bg-zinc-400']"
  >
    <label
      :for="id"
      class="absolute left-0 w-6 h-6 mb-2 transition duration-100 ease-linear transform bg-white border-2 rounded-full cursor-pointer"
      :class="[modelValue ? 'translate-x-full border-violet-500' : 'translate-x-0 border-zinc-400']"
    ></label>
    <input
      type="checkbox"
      :id="id"
      :name="id"
      class="w-full h-full appearance-none focus:outline-none"
      :value="modelValue"
      @input="emit('update:modelValue', !modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  modelValue: boolean
}

withDefaults(defineProps<Props>(), { modelValue: false })

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()
</script>
