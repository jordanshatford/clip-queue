<template>
  <button
    @click="() => theme.toggle()"
    class="text-2xl border-none focus:outline-none p-2 hover:text-purple-500 dark:hover:text-purple-500 text-gray-500 dark:text-gray-200 dark:bg-gray-800"
  >
    <v-icon v-if="theme.state.theme === 'dark'" icon="sun" />
    <v-icon v-else :icon="['far', 'moon']" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { theme } from "@/stores/theme";

export default defineComponent({
  setup() {
    return {
      theme,
    };
  },
});
</script>
