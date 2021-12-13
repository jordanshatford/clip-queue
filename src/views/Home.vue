<template>
  <div class="dark:text-white">
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/stores/user";

export default defineComponent({
  setup() {
    return {
      userStore,
    };
  },
});
</script>
