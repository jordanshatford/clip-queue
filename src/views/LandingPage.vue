<template>
  <p class="cq-title">{{ title }}</p>
  <p class="cq-text">{{ description }}</p>
  <p class="cq-heading">Features:</p>
  <ol>
    <li v-for="(feature, index) in features" :key="index">
      <p class="cq-text">{{ feature }}</p>
    </li>
  </ol>
  <p class="cq-heading">Screenshot:</p>
  <img src="@/assets/example.png" />
</template>

<script setup lang="ts">
import config from "@/assets/config"

const { title, description, features } = config.App
</script>
