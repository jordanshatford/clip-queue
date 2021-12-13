<template>
  <div>
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
    <AuthButton :isLoggedIn="userStore.user.isLoggedIn" :login="userStore.login" :logout="userStore.logout" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/stores/user";
import AuthButton from "@/components/AuthButton.vue";

export default defineComponent({
  components: {
    AuthButton,
  },
  setup() {
    return {
      userStore,
    };
  },
});
</script>
