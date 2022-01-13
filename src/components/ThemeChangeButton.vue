<template>
  <button
    @click="() => theme.toggle()"
    class="border-none focus:outline-none p-2 hover:text-purple-500 dark:hover:text-purple-500 text-gray-500 dark:text-gray-200 dark:bg-gray-800"
  >
    <moon-icon v-if="theme.state.theme === 'dark'" />
    <sun-icon v-else />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { theme } from "@/stores/theme";
import MoonIcon from "@/components/icons/Moon.vue";
import SunIcon from "@/components/icons/Sun.vue";

export default defineComponent({
  components: {
    MoonIcon,
    SunIcon,
  },
  setup() {
    return {
      theme,
    };
  },
});
</script>
