<template>
  <div class="dark:text-white">
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
    <player :clip="clipQueue.state.currentClip" autoplay />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/stores/user";
import Player from "@/components/Player.vue";
import { clipQueue } from "@/stores/queue";

export default defineComponent({
  components: {
    Player,
  },
  setup() {
    return {
      userStore,
      clipQueue,
    };
  },
});
</script>
