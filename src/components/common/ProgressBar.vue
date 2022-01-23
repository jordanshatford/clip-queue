<template>
  <div class="w-full bg-gray-200 dark:bg-gray-700">
    <div
      class="text-xs font-medium text-gray-200 text-center p-0.5 leading-none"
      :class="classNames"
      :style="`width: ${value}%`"
    >
      {{ value }}%
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true,
    },
    variant: {
      type: String as PropType<"primary" | "danger" | "brand">,
      default: "primary",
    },
  },
  computed: {
    classNames() {
      let classes = "bg-blue-500";
      switch (this.variant) {
        case "brand": {
          classes = "bg-purple-500";
          break;
        }
        case "danger": {
          classes = "bg-red-500";
          break;
        }
      }
      return classes;
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
