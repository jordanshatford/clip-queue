<template>
  <v-button variant="brand" @click="() => (isLoggedIn ? logoutHandler() : login())">
    {{ isLoggedIn ? "Logout" : "Login" }}
  </v-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
  methods: {
    async logoutHandler(): Promise<void> {
      this.logout();
      await this.$router.push({ path: "/" });
    },
  },
  setup(props) {
    return {
      props,
    };
  },
});
</script>
