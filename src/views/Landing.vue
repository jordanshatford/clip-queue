<template>
  <div class="text-center">
    <p class="text-5xl font-extrabold text-purple-500 p-5">
      {{ title }}
    </p>
    <p class="dark:text-gray-300">
      {{ description }}
    </p>
    <p class="text-2xl font-extrabold text-purple-500 pt-5 pb-1">Features:</p>
    <ol class="text-center">
      <li v-for="(feature, index) in features" :key="index" class="dark:text-gray-300">
        {{ feature }}
      </li>
    </ol>
    <p class="text-2xl font-extrabold text-purple-500 pt-5 pb-1">Screenshot:</p>
    <img src="@/assets/example.png" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import config from "@/assets/config";

export default defineComponent({
  setup() {
    const { title, description, features } = config.App;
    return {
      title,
      description,
      features,
    };
  },
});
</script>
