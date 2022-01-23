<template>
  <div class="dark:bg-gray-800 w-full max-w-sm mx-auto rounded-lg shadow-md overflow-hidden">
    <div
      class="flex items-end justify-end h-56 w-full bg-cover"
      :style="'background-image: url(' + clip.thumbnailUrl + ')'"
    >
      <Button class="pb-1 mr-3 -mb-2" @click="$emit('play')">
        <v-icon icon="play" class="w-5 h-5" />
      </Button>
      <Button variant="danger" class="pb-1 mr-3 -mb-2" @click="$emit('remove')">
        <v-icon icon="trash" class="w-5 h-5" />
      </Button>
    </div>
    <div class="px-5 py-3 text-gray-500">
      <span class="text-gray-700 dark:text-gray-400 mt-2">{{ clip.title }}</span>
      <h3 class="font-bold">{{ clip.channel }}<span class="font-normal"> playing </span>{{ clip.game }}</h3>
      <span class="mt-2"
        >Submitted by: <span class="font-bold">{{ clip.submitter }}</span></span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Clip } from "@/interfaces/clips";
import { defineComponent, PropType } from "vue";
import Button from "@/components/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  props: {
    clip: {
      type: Object as PropType<Clip>,
      required: true,
    },
  },
  emits: ["play", "remove"],
  setup(props) {
    return {
      props,
    };
  },
});
</script>
