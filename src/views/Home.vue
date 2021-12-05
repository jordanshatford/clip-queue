<template>
  <div class="home">
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
    <button v-if="!userStore.user.isLoggedIn" @click="() => userStore.login()">LOGIN</button>
    <button v-else @click="() => userStore.logout()">LOGOUT</button>
  </div>
</template>

<script lang="ts">
import { userStore } from "@/stores/user";

export default {
  setup() {
    return {
      userStore,
    };
  },
};
</script>
