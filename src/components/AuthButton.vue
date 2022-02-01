<template>
  <v-button variant="brand" @click="() => (isLoggedIn ? logoutHandler() : login())">
    {{ isLoggedIn ? "Logout" : "Login" }}
  </v-button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { useRouter } from "vue-router";

interface Props {
  isLoggedIn?: boolean;
  login: () => void;
  logout: () => void;
}

const router = useRouter();
const props = withDefaults(defineProps<Props>(), { isLoggedIn: false });

async function logoutHandler() {
  props.logout();
  await router.push({ path: "/" });
}
</script>
