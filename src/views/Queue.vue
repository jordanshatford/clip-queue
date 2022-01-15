<template>
  <div class="dark:text-white">
    <p>Logged in: {{ userStore.user.isLoggedIn }}</p>
    <p>Current Login: {{ userStore.user.username }}</p>
    <player :clip="clip" autoplay />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { userStore } from "@/stores/user";
import Player from "@/components/Player.vue";
import { Clip } from "@/interfaces/clips";

export default defineComponent({
  components: {
    Player,
  },
  setup() {
    const clip: Clip = {
      id: "AthleticCloudyHerringDancingBanana-M3MvGqjBFmrxHgMp",
      title: "Soda shows off his most recent League Build searches (ft. Veibae)",
      channel: "sodapoppin",
      game: "League of Legends",
      timestamp: new Date().toISOString(),
      submitter: "Qwerty_Legend",
      url: "https://clips.twitch.tv/AthleticCloudyHerringDancingBanana-M3MvGqjBFmrxHgMp",
      thumbnailUrl: "https://clips-media-assets2.twitch.tv/45145041693-offset-2482-preview-480x272.jpg",
    };

    return {
      userStore,
      clip,
    };
  },
});
</script>
