<template>
  <button
    :class="[
      modelValue ? 'hover:text-red-500 dark:hover:text-red-500' : 'hover:text-brand-500 dark:hover:text-brand-500',
    ]"
    class="text-zinc-500 dark:text-zinc-200 w-10 h-10 relative focus:outline-none"
    @click="emit('update:modelValue', !modelValue)"
  >
    <div class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <span
        aria-hidden="true"
        class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
        :class="{ 'rotate-45': modelValue, ' -translate-y-1.5': !modelValue }"
      ></span>
      <span
        aria-hidden="true"
        class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
        :class="{ 'opacity-0': modelValue }"
      ></span>
      <span
        aria-hidden="true"
        class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out"
        :class="{ '-rotate-45': modelValue, ' translate-y-1.5': !modelValue }"
      ></span>
    </div>
  </button>
</template>

<script setup lang="ts">
export interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()
</script>
