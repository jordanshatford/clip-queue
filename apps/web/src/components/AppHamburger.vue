<template>
  <button
    :class="[
      modelValue
        ? 'hover:text-red-500 dark:hover:text-red-500'
        : 'hover:text-primary-700 dark:hover:text-primary-700'
    ]"
    class="relative h-10 w-10 text-surface-500 focus:outline-none dark:text-surface-200"
    @click="modelValue = !modelValue"
  >
    <div class="absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2 transform">
      <span
        aria-hidden="true"
        class="absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out"
        :class="{ 'rotate-45': modelValue, ' -translate-y-1.5': !modelValue }"
      />
      <span
        aria-hidden="true"
        class="absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out"
        :class="{ 'opacity-0': modelValue }"
      />
      <span
        aria-hidden="true"
        class="absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out"
        :class="{ '-rotate-45': modelValue, ' translate-y-1.5': !modelValue }"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ required: true })
</script>
