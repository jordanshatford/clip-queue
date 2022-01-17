<template>
  <div class="dark:text-white">
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
    <twitch-clip-player :clip="clipQueue.state.currentClip" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/stores/user";
import TwitchClipPlayer from "@/components/TwichClipPlayer.vue";
import { clipQueue } from "@/stores/queue";

export default defineComponent({
  components: {
    TwitchClipPlayer,
  },
  setup() {
    return {
      userStore,
      clipQueue,
    };
  },
});
</script>
