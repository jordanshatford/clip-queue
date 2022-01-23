<template>
  <div class="w-full bg-gray-200 dark:bg-gray-700">
    <div
      class="bg-purple-500 text-xs font-medium text-gray-200 text-center p-0.5 leading-none"
      :style="`width: ${value}%`"
    >
      {{ value }}%
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
