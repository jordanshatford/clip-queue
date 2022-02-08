<template>
  <div class="text-center">
    <p class="text-5xl font-extrabold text-violet-500 p-5">
      {{ title }}
    </p>
    <p class="dark:text-zinc-300">
      {{ description }}
    </p>
    <p class="text-2xl font-extrabold text-violet-500 pt-5 pb-1">Features:</p>
    <ol class="text-center">
      <li v-for="(feature, index) in features" :key="index" class="dark:text-zinc-300">
        {{ feature }}
      </li>
    </ol>
    <p class="text-2xl font-extrabold text-violet-500 pt-5 pb-1">Screenshot:</p>
    <img src="@/assets/example.png" />
  </div>
</template>

<script setup lang="ts">
import config from "@/assets/config"

const { title, description, features } = config.App
</script>
