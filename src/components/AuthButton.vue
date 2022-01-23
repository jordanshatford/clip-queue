<template>
  <v-button variant="brand" @click="() => (isLoggedIn ? logoutHandler() : login())">
    {{ isLoggedIn ? "Logout" : "Login" }}
  </v-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    login: {
      type: Function,
      required: true,
    },
    logout: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    async function logoutHandler(): Promise<void> {
      props.logout();
      await router.push({ path: "/" });
    }
    return {
      props,
      logoutHandler,
    };
  },
});
</script>
