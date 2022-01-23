<template>
  <router-link v-if="route" :to="route.path" :class="classNames">
    {{ route.name }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { RouteRecordRaw } from "vue-router";

export default defineComponent({
  props: {
    isMobileMenu: {
      type: Boolean,
      default: false,
    },
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
  },
  computed: {
    classNames() {
      let classNames = "px-3 py-2 rounded-lg text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
      if (this.isMobileMenu) {
        classNames += " block";
      }
      return classNames;
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
