<template>
  <router-link v-if="route" :to="route?.path ?? ''" :class="classNames">
    {{ route?.name ?? "" }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isMobileMenu: {
      type: Boolean,
      default: false,
    },
    route: {
      type: Object,
    },
  },
  setup(props) {
    let classNames = "px-3 py-2 rounded-lg text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
    if (props.isMobileMenu) {
      classNames += " block";
    }
    return {
      props,
      classNames,
    };
  },
});
</script>
