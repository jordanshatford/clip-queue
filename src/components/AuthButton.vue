<template>
  <Button @click="() => (isLoggedIn ? logout() : login())">
    {{ isLoggedIn ? "Logout" : "Login" }}
  </Button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/Button.vue";

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
    return {
      props,
    };
  },
});
</script>
