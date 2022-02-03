<template>
  <div
    class="relative w-12 h-6 transition duration-200 ease-linear rounded-full"
    :class="[props.modelValue ? 'bg-purple-500' : 'bg-gray-400']"
  >
    <label
      for="toggle"
      class="absolute left-0 w-6 h-6 mb-2 transition duration-100 ease-linear transform bg-white border-2 rounded-full cursor-pointer"
      :class="[props.modelValue ? 'translate-x-full border-purple-500' : 'translate-x-0 border-gray-400']"
    ></label>
    <input
      type="checkbox"
      id="toggle"
      name="toggle"
      class="w-full h-full appearance-none focus:outline-none"
      :value="props.modelValue"
      @input="emit('update:modelValue', !props.modelValue)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from "vue";

interface Props {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Props>(), { modelValue: false });

const emit = defineEmits(["update:modelValue"]);
</script>
