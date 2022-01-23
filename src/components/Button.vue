<template>
  <button
    class="disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 border-b-4 rounded-lg"
    :class="classes"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    variant: {
      type: String as PropType<"primary" | "danger" | "brand">,
      default: "primary",
    },
  },
  setup(props) {
    let classes = "bg-blue-500 border-blue-700 hover:bg-blue-400 hover:border-blue-500";
    switch (props.variant) {
      case "brand": {
        classes = "bg-purple-500 border-purple-700 hover:bg-purple-400 hover:border-purple-500";
        break;
      }
      case "danger": {
        classes = "bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500";
        break;
      }
    }
    return {
      props,
      classes,
    };
  },
});
</script>
