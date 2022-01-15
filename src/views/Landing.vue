<template>
  <div class="text-center">
    <p class="text-5xl font-extrabold text-purple-500 p-5">
      {{ title }}
    </p>
    <p class="dark:text-gray-300">
      {{ description }}
    </p>
    <p class="text-2xl font-extrabold text-purple-500 p-5">Features:</p>
    <ol class="list-decimal md:mx-32 mx-6 text-left">
      <li v-for="(feature, index) in features" :key="index" class="dark:text-gray-300">
        {{ feature }}
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/config";

const { title, description, features } = config.App;

export default defineComponent({
  setup() {
    return {
      title,
      description,
      features,
    };
  },
});
</script>
