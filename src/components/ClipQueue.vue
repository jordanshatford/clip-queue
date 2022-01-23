<template>
  <div class="mx-0 mt-2">
    <v-progress-bar v-if="percentComplete" variant="brand" :value="percentComplete" />
    <div class="w-full mb-2 mt-1 border-t border-gray-300 dark:border-gray-700"></div>
    <v-button :variant="isOpen ? 'danger' : 'primary'" class="float-right" @click="$emit(isOpen ? 'close' : 'open')">
      {{ isOpen ? "Close" : "Open" }} Queue
    </v-button>
    <h3 class="text-gray-600 dark:text-gray-400 text-lg">{{ title }}</h3>
    <span class="mt-3 text-sm text-gray-400 dark:text-gray-600">
      {{ queue.length }} {{ queue.length === 1 ? "clip" : "clips" }}
    </span>
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
      <clip-queue-item
        v-for="clip in queue"
        :key="clip.id"
        :clip="clip"
        @play="$emit('play', clip)"
        @remove="$emit('remove', clip)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ClipQueueItem from "@/components/ClipQueueItem.vue";
import { Clip } from "@/interfaces/clips";

export default defineComponent({
  components: {
    ClipQueueItem,
  },
  props: {
    title: {
      type: String,
      default: "Queue",
    },
    queue: {
      type: Array as PropType<Clip[]>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    percentComplete: {
      type: Number,
      default: 0,
    },
  },
  emits: ["play", "remove", "open", "close"],
  setup(props) {
    return {
      props,
    };
  },
});
</script>
