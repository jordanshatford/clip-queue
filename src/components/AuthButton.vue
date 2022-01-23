<template>
  <Button variant="brand" @click="() => (isLoggedIn ? logoutHandler() : login())">
    {{ isLoggedIn ? "Logout" : "Login" }}
  </Button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    Button,
  },
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
      await router.push({ path: "/" });
      props.logout();
    }
    return {
      props,
      logoutHandler,
    };
  },
});
</script>
