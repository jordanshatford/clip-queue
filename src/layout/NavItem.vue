<template>
  <router-link v-if="route" :to="route?.path ?? ''" :class="classNames">
    {{ route?.name ?? "" }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

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
    const currentRoute = useRoute();
    let classNames = "px-3 py-2 rounded-lg";
    if (props.isMobileMenu) {
      classNames += " block";
    }
    if (currentRoute.path === props.route?.path) {
      classNames += " text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-900";
    } else {
      classNames += " text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
    }
    return {
      props,
      classNames,
    };
  },
});
</script>
